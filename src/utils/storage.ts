export const storage = {
  // User management
  setUser: (user: any) => {
    localStorage.setItem('career_chat_user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('career_chat_user');
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('career_chat_user');
  },
  
  // Chat sessions
  saveChatSession: (session: any) => {
    const sessions = storage.getChatSessions();
    const existingIndex = sessions.findIndex((s: any) => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    
    localStorage.setItem('career_chat_sessions', JSON.stringify(sessions));
  },
  
  getChatSessions: () => {
    const sessions = localStorage.getItem('career_chat_sessions');
    return sessions ? JSON.parse(sessions) : [];
  },
  
  deleteChatSession: (sessionId: string) => {
    const sessions = storage.getChatSessions();
    const filtered = sessions.filter((s: any) => s.id !== sessionId);
    localStorage.setItem('career_chat_sessions', JSON.stringify(filtered));
  },
  
  // Settings
  saveSettings: (settings: any) => {
    localStorage.setItem('career_chat_settings', JSON.stringify(settings));
  },
  
  getSettings: () => {
    const settings = localStorage.getItem('career_chat_settings');
    return settings ? JSON.parse(settings) : null;
  }
};