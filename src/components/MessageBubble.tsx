import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Volume2, Copy, Check, User, Bot } from 'lucide-react';
import { Message } from '../types';
import { speechService } from '../utils/speech';

interface MessageBubbleProps {
  message: Message;
  onReaction: (messageId: string, reaction: 'helpful' | 'notHelpful', value: boolean) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onReaction }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await speechService.speak(message.text, message.language);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'en-US': '🇺🇸',
      'en-IN': '🇮🇳',
      'hi-IN': '🇮🇳',
      'ta-IN': '🇮🇳',
      'te-IN': '🇮🇳',
      'bn-IN': '🇮🇳',
      'mr-IN': '🇮🇳',
      'gu-IN': '🇮🇳',
      'kn-IN': '🇮🇳',
      'ml-IN': '🇮🇳',
      'pa-IN': '🇮🇳',
      'ur-IN': '🇮🇳'
    };
    return flags[language] || '🌐';
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex space-x-3 max-w-4xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          message.sender === 'user' 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
            : 'bg-gradient-to-r from-green-500 to-teal-600'
        }`}>
          {message.sender === 'user' ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div
            className={`relative px-4 py-3 rounded-2xl shadow-lg ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                : 'bg-gray-800/70 backdrop-blur-sm text-gray-100 border border-gray-700'
            }`}
          >
            {/* Language indicator */}
            <div className={`absolute -top-2 ${message.sender === 'user' ? '-left-2' : '-right-2'} text-xs bg-gray-900 px-2 py-1 rounded-full flex items-center space-x-1`}>
              <span>{getLanguageFlag(message.language)}</span>
              <span className="text-gray-400">{message.language.split('-')[0].toUpperCase()}</span>
            </div>
            
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          </div>

          {/* Message Actions */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>

            {message.sender === 'assistant' && (
              <div className="flex items-center space-x-1">
                {/* Speak Button */}
                <button
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSpeaking 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-gray-300'
                  }`}
                  title="Read aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-gray-300 rounded-lg transition-colors"
                  title="Copy message"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Reaction Buttons */}
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => onReaction(message.id, 'helpful', !message.reactions?.helpful)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      message.reactions?.helpful
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-green-400'
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onReaction(message.id, 'notHelpful', !message.reactions?.notHelpful)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      message.reactions?.notHelpful
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-red-400'
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;