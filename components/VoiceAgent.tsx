import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, MessageCircle, Volume2, Loader2 } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';
import { VoiceState } from '../types';

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
      setVoiceState(VoiceState.CONNECTING);
      setError(null);
      setTranscription('');

      // Create new instance before connect to ensure latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
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
            // Handle output transcription for better user visibility of "working" state
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
                    setTranscription('');
                  }
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setVoiceState(VoiceState.LISTENING);
              setTranscription('');
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            setError('Connection encountered an error. Please retry.');
            setVoiceState(VoiceState.ERROR);
          },
          onclose: () => {
            setVoiceState(VoiceState.IDLE);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {}, // Enabled for user feedback
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
          },
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError('Microphone access or connection failed.');
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

    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    setVoiceState(VoiceState.IDLE);
    setTranscription('');
  }, []);

  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, [stopConversation]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] bg-slate-900 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition active:scale-95 group"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition" />
        <span className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
      </button>

      {/* Agent Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 pb-12 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition"
                aria-label="Close Assistant"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="mt-8 mb-6 relative inline-block">
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                  voiceState === VoiceState.SPEAKING ? 'border-slate-900 scale-105 shadow-xl' : 
                  voiceState === VoiceState.LISTENING ? 'border-green-500 animate-pulse' : 
                  'border-slate-100'
                }`}>
                  <div className={`w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center transition-colors ${
                    voiceState === VoiceState.IDLE ? 'text-slate-300' : 'text-slate-900'
                  }`}>
                    {voiceState === VoiceState.SPEAKING ? <Volume2 className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
                  </div>
                </div>
                {voiceState === VoiceState.CONNECTING && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
                  </div>
                )}
              </div>

              <h3 className="text-3xl font-light mb-2">Chris Corbett Studio</h3>
              <p className="text-slate-400 uppercase tracking-widest text-xs mb-8">AI Design Assistant</p>
              
              <div className="mb-10 min-h-[4rem] px-4">
                {voiceState === VoiceState.IDLE && (
                  <p className="text-slate-600 leading-relaxed italic">
                    "Talk to our studio assistant about your landscape vision, project timelines, or design philosophy."
                  </p>
                )}
                {voiceState === VoiceState.LISTENING && (
                  <p className="text-green-600 font-medium tracking-wide">I'm listening...</p>
                )}
                {voiceState === VoiceState.SPEAKING && (
                  <div className="space-y-2">
                    <p className="text-slate-900 font-medium">Assistant is responding...</p>
                    {transcription && (
                      <p className="text-sm text-slate-500 italic line-clamp-2">"{transcription.trim()}"</p>
                    )}
                  </div>
                )}
                {voiceState === VoiceState.CONNECTING && (
                  <p className="text-slate-400">Establishing secure connection...</p>
                )}
                {error && (
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                {voiceState === VoiceState.IDLE ? (
                  <button 
                    onClick={handleStartConversation}
                    className="flex items-center space-x-3 bg-slate-900 text-white px-10 py-5 rounded-full hover:bg-slate-800 transition shadow-lg active:scale-95"
                  >
                    <Mic className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-sm">Start Voice Chat</span>
                  </button>
                ) : (
                  <button 
                    onClick={stopConversation}
                    className="flex items-center space-x-3 bg-red-50 text-red-600 border border-red-200 px-10 py-5 rounded-full hover:bg-red-100 transition shadow-sm active:scale-95"
                  >
                    <MicOff className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-sm">End Session</span>
                  </button>
                )}
              </div>
              
              <p className="mt-8 text-xs text-slate-400 max-w-xs mx-auto">
                Powered by Gemini Live API. Conversation is processed in real-time.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAgent;