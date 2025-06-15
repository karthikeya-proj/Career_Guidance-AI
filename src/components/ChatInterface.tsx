import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, X, Loader } from 'lucide-react';
import { Message, ChatSession } from '../types';
import { storage } from '../utils/storage';
import { ollamaService } from '../utils/ollama';
import { speechService } from '../utils/speech';
import MessageBubble from './MessageBubble';
import VoiceControls from './VoiceControls';
import ChatSidebar from './ChatSidebar';

interface ChatInterfaceProps {
  user: any;
  onLogout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadChatSessions();
    createNewChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = () => {
    const sessions = storage.getChatSessions();
    setChatSessions(sessions);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentSessionId(newSession.id);
    setMessages([]);
    setChatSessions(prev => [newSession, ...prev]);
    storage.saveChatSession(newSession);
  };

  const saveCurrentSession = (updatedMessages: Message[]) => {
    if (!currentSessionId) return;

    const updatedSession: ChatSession = {
      id: currentSessionId,
      title: getSessionTitle(updatedMessages),
      messages: updatedMessages,
      createdAt: chatSessions.find(s => s.id === currentSessionId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storage.saveChatSession(updatedSession);
    setChatSessions(prev => prev.map(s => s.id === currentSessionId ? updatedSession : s));
  };

  const getSessionTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(m => m.sender === 'user');
    if (firstUserMessage) {
      return firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
    }
    return 'New Chat';
  };

  const handleSessionSelect = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    storage.deleteChatSession(sessionId);
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);

    if (currentSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        handleSessionSelect(updatedSessions[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const handleSendMessage = async (text?: string, detectedLanguage?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      language: detectedLanguage || currentLanguage
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);
    setIsProcessing(true);

    try {
      // Get conversation context
      const context = updatedMessages
        .slice(-6) // Last 6 messages for context
        .map(m => `${m.sender}: ${m.text}`)
        .join('\n');

      const response = await ollamaService.generateResponse(messageText, context);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        language: detectedLanguage || currentLanguage,
        reactions: { helpful: false, notHelpful: false }
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);

      // Auto-speak the response if it was a voice input
      if (text && speechService.isSpeechSynthesisSupported()) {
        try {
          await speechService.speak(response, detectedLanguage || currentLanguage);
        } catch (error) {
          console.error('Speech synthesis error:', error);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please check if Ollama is running on your system or try again when you're back online.",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        language: currentLanguage,
        reactions: { helpful: false, notHelpful: false }
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleReaction = (messageId: string, reaction: 'helpful' | 'notHelpful', value: boolean) => {
    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          reactions: {
            ...message.reactions,
            [reaction]: value,
            // If setting one reaction to true, set the other to false
            ...(value && reaction === 'helpful' ? { notHelpful: false } : {}),
            ...(value && reaction === 'notHelpful' ? { helpful: false } : {})
          }
        };
      }
      return message;
    });

    setMessages(updatedMessages);
    saveCurrentSession(updatedMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = (text: string, language: string) => {
    setCurrentLanguage(language);
    speechService.setLanguage(language);
    handleSendMessage(text, language);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      {/* Sidebar */}
      <ChatSidebar
        sessions={chatSessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={createNewChat}
        onDeleteSession={handleDeleteSession}
        onLogout={onLogout}
        user={user}
        isCollapsed={sidebarCollapsed}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Career Guidance AI</h1>
              <p className="text-sm text-gray-400">Get personalized career advice and guidance</p>
            </div>
          </div>

          <VoiceControls
            onVoiceInput={handleVoiceInput}
            onLanguageChange={setCurrentLanguage}
            currentLanguage={currentLanguage}
            isProcessing={isProcessing}
          />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Career Guidance AI</h2>
                <p className="text-gray-400 mb-6">
                  I'm here to help you explore career paths, understand your strengths, and make informed decisions about your future. 
                  You can type your questions or use the microphone to speak in your preferred language.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                    <p className="text-gray-300">💼 "What career fits my interests in technology and creativity?"</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                    <p className="text-gray-300">📚 "What skills should I develop for data science?"</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                    <p className="text-gray-300">🎯 "How do I choose between engineering and business?"</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                    <p className="text-gray-300">🚀 "What are emerging career opportunities?"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReaction={handleReaction}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-4xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <Loader className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-gray-300 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about career guidance, or use the microphone to speak..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32"
                rows={1}
                style={{ minHeight: '48px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;