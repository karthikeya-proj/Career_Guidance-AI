import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Globe, Wifi, WifiOff } from 'lucide-react';
import { speechService } from '../utils/speech';
import { ollamaService } from '../utils/ollama';

interface VoiceControlsProps {
  onVoiceInput: (text: string, language: string) => void;
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
  isProcessing: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  onVoiceInput,
  onLanguageChange,
  currentLanguage,
  isProcessing
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const supportedLanguages = speechService.getSupportedLanguages();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate voice level animation when listening
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening) {
      interval = setInterval(() => {
        setVolumeLevel(Math.random() * 100);
      }, 100);
    } else {
      setVolumeLevel(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  const handleVoiceInput = async () => {
    if (isListening || isProcessing) return;

    try {
      setIsListening(true);
      speechService.setLanguage(currentLanguage);
      const transcript = await speechService.startListening();
      
      if (transcript.trim()) {
        const detectedLanguage = speechService.detectLanguage(transcript);
        onVoiceInput(transcript, detectedLanguage);
      }
    } catch (error) {
      console.error('Voice input error:', error);
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const stopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const handleLanguageSelect = (language: string) => {
    onLanguageChange(language);
    setShowLanguageSelect(false);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Online/Offline Status */}
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
        isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setShowLanguageSelect(!showLanguageSelect)}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">
            {supportedLanguages[currentLanguage as keyof typeof supportedLanguages] || 'English'}
          </span>
        </button>

        {showLanguageSelect && (
          <div className="absolute bottom-full mb-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-48 max-h-64 overflow-y-auto">
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageSelect(code)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-sm ${
                  currentLanguage === code ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice Input Button */}
      <div className="relative">
        <button
          onClick={isListening ? stopListening : handleVoiceInput}
          disabled={isProcessing}
          className={`relative p-3 rounded-full transition-all duration-200 disabled:opacity-50 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          
          {/* Voice level indicator */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />
          )}
        </button>

        {/* Volume visualization */}
        {isListening && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div 
              className="w-2 h-2 bg-white rounded-full transition-transform duration-100"
              style={{ transform: `scale(${Math.max(0.5, volumeLevel / 100)})` }}
            />
          </div>
        )}
      </div>

      {/* Speaker Control */}
      <button
        onClick={isSpeaking ? stopSpeaking : undefined}
        className={`p-3 rounded-full transition-all duration-200 ${
          isSpeaking
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400'
        }`}
        disabled={!isSpeaking}
      >
        {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Status Indicators */}
      <div className="flex items-center space-x-2 text-xs text-gray-400">
        {isListening && (
          <div className="flex items-center space-x-1 text-red-400">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span>Listening...</span>
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center space-x-1 text-yellow-400">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span>Processing...</span>
          </div>
        )}
        {isSpeaking && (
          <div className="flex items-center space-x-1 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Speaking...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControls;