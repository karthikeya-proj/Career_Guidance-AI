export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  language: string;
  reactions?: {
    helpful: boolean;
    notHelpful: boolean;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface VoiceSettings {
  language: string;
  voice?: SpeechSynthesisVoice;
  rate: number;
  pitch: number;
}

export interface CareerProfile {
  interests: string[];
  skills: string[];
  subjects: string[];
  goals: string[];
}