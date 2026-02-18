
import React from 'react';

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export enum VoiceState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR'
}
