import React from 'react';
import { MessageSquare, Plus, Trash2, User, LogOut, Settings } from 'lucide-react';
import { ChatSession } from '../types';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onLogout: () => void;
  user: any;
  isCollapsed: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  onLogout,
  user,
  isCollapsed
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getTitleFromFirstMessage = (session: ChatSession) => {
    const firstUserMessage = session.messages.find(m => m.sender === 'user');
    if (firstUserMessage) {
      return firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
    }
    return 'New Chat';
  };

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm border-r border-gray-700 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        {!isCollapsed && (
          <button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        )}
        
        {isCollapsed && (
          <button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!isCollapsed && sessions.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No chat history yet</p>
            <p className="text-xs mt-2">Start a conversation to see your chats here</p>
          </div>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative rounded-lg transition-all duration-200 ${
              currentSessionId === session.id
                ? 'bg-indigo-500/20 border border-indigo-500/30'
                : 'bg-gray-800/30 hover:bg-gray-700/50 border border-transparent'
            }`}
          >
            <button
              onClick={() => onSessionSelect(session.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                isCollapsed ? 'flex items-center justify-center' : ''
              }`}
              title={isCollapsed ? getTitleFromFirstMessage(session) : undefined}
            >
              {isCollapsed ? (
                <MessageSquare className="w-5 h-5 text-gray-300" />
              ) : (
                <div>
                  <h3 className="text-white font-medium text-sm mb-1 truncate">
                    {getTitleFromFirstMessage(session)}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {formatDate(session.updatedAt)}
                  </p>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <button
                onClick={() => onDeleteSession(session.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed ? (
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button className="w-full p-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;