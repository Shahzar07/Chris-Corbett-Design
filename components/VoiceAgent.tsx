import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, MessageCircle, Volume2, Loader2 } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants.tsx';
import { VoiceState } from '../types.ts';

// Manual implementation of encode/decode for raw audio data as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);

  const handleStartConversation = async () => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
      if (!apiKey) {
        setError('Studio Key missing. Please check configuration.');
        setVoiceState(VoiceState.ERROR);
        return;
      }

      setVoiceState(VoiceState.CONNECTING);
      setError(null);
      setTranscription('');

      const ai = new GoogleGenAI({ apiKey });
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx({ sampleRate: 16000 });
      }
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });
      }

      await audioContextRef.current.resume();
      await outputAudioContextRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setVoiceState(VoiceState.LISTENING);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent!.outputTranscription!.text);
            }

            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              const audioData = part.inlineData?.data;
              if (audioData) {
                setVoiceState(VoiceState.SPEAKING);
                const ctx = outputAudioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) {
                    setVoiceState(VoiceState.LISTENING);
                  }
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setVoiceState(VoiceState.LISTENING);
            }
          },
          onerror: (e) => {
            console.error('AI session error:', e);
            setError('Studio connection lost. Retrying...');
            setVoiceState(VoiceState.ERROR);
          },
          onclose: () => {
            setVoiceState(VoiceState.IDLE);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
          },
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error('Voice setup failed:', err);
      setError('Microphone access denied or connection failed.');
      setVoiceState(VoiceState.ERROR);
    }
  };

  const stopConversation = useCallback(() => {
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
    
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
    sourcesRef.current.clear();
    setVoiceState(VoiceState.IDLE);
    setTranscription('');
  }, []);

  useEffect(() => {
    return () => { stopConversation(); };
  }, [stopConversation]);

  return (
    <>
      {/* Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] bg-slate-900 text-white w-14 h-14 md:w-18 md:h-18 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group overflow-hidden"
        aria-label="Studio Voice Assistant"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageCircle className="relative w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute top-1 right-1 md:top-2 md:right-2 bg-green-500 w-3 h-3 rounded-full border-2 border-slate-900"></span>
      </button>

      {/* Agent Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-500">
            <div className="p-10 pb-16 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-300 hover:text-slate-900" />
              </button>

              <div className="mt-6 mb-10 relative inline-block">
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-[1px] flex items-center justify-center transition-all duration-700 ${
                  voiceState === VoiceState.SPEAKING ? 'border-slate-900 scale-105 shadow-2xl' : 
                  voiceState === VoiceState.LISTENING ? 'border-green-500 shadow-xl animate-pulse' : 
                  'border-slate-100'
                }`}>
                  <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-slate-50 flex items-center justify-center transition-all ${
                    voiceState === VoiceState.IDLE ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    {voiceState === VoiceState.SPEAKING ? <Volume2 className="w-12 h-12 animate-bounce" /> : <Mic className="w-12 h-12" />}
                  </div>
                </div>
                {voiceState === VoiceState.CONNECTING && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                    <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-10">
                <h3 className="text-2xl md:text-3xl font-light tracking-tight">Chris Corbett Studio</h3>
                <p className="text-slate-400 uppercase tracking-[0.3em] text-[10px] font-bold">Design AI Concierge</p>
              </div>
              
              <div className="mb-12 min-h-[5rem] px-4 flex items-center justify-center">
                {voiceState === VoiceState.IDLE && (
                  <p className="text-slate-500 text-base font-light italic leading-relaxed">
                    "Experience our design philosophy first-hand. Inquire about timelines, materials, or our global portfolio."
                  </p>
                )}
                {voiceState === VoiceState.LISTENING && (
                  <div className="space-y-2">
                    <p className="text-green-600 font-bold uppercase tracking-[0.2em] text-[10px]">Active Session</p>
                    <p className="text-slate-400 font-light">The studio is listening...</p>
                  </div>
                )}
                {voiceState === VoiceState.SPEAKING && (
                  <div className="space-y-3">
                    <p className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px]">Responding</p>
                    {transcription && (
                      <p className="text-sm text-slate-400 font-light italic line-clamp-2 max-w-xs mx-auto">"{transcription.trim()}"</p>
                    )}
                  </div>
                )}
                {error && (
                  <p className="text-red-500 text-sm font-medium bg-red-50 px-6 py-3 rounded-full">{error}</p>
                )}
              </div>

              <div className="flex justify-center">
                {voiceState === VoiceState.IDLE ? (
                  <button 
                    onClick={handleStartConversation}
                    className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-slate-900 text-white px-12 py-5 rounded-full hover:bg-slate-800 transition shadow-2xl active:scale-95"
                  >
                    <Mic className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Enter Studio Chat</span>
                  </button>
                ) : (
                  <button 
                    onClick={stopConversation}
                    className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white border border-slate-100 text-slate-400 px-12 py-5 rounded-full hover:bg-slate-50 transition shadow-sm active:scale-95"
                  >
                    <MicOff className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Close Session</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAgent;