/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ChatSession, Message } from './types';
import { streamChatResponse } from './services/gemini';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('nova_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    return sessions.length > 0 ? sessions[0].id : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('nova_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) {
      // Create a session first if none exists
      const newId = uuidv4();
      const newSession: ChatSession = {
        id: newId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newId);
      
      // We need to wait for state to update or use the new session directly
      processMessage(newId, content);
    } else {
      processMessage(currentSessionId, content);
    }
  };

  const processMessage = async (sessionId: string, content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Add user message and prepare assistant message
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          messages: [...s.messages, userMessage],
          updatedAt: Date.now()
        };
      }
      return s;
    }));

    setIsLoading(true);

    try {
      const assistantMessageId = uuidv4();
      let assistantContent = '';

      // Get latest messages for context
      const currentSess = sessions.find(s => s.id === sessionId);
      const allMessages = [...(currentSess?.messages || []), userMessage];

      const stream = streamChatResponse(allMessages);
      
      // Create empty assistant message first
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: assistantMessageId,
              role: 'assistant',
              content: '',
              timestamp: Date.now()
            }]
          };
        }
        return s;
      }));

      for await (const chunk of stream) {
        assistantContent += chunk;
        
        // Update assistant message in real-time
        setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === assistantMessageId ? { ...m, content: assistantContent } : m
              ),
              // Update title if it's the first exchange
              title: s.messages.length <= 2 
                ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                : s.title
            };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error(error);
      // Add error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong.'}`,
        timestamp: Date.now()
      };
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, messages: [...s.messages, errorMessage] } : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(sessions.length > 1 ? sessions[0].id === id ? sessions[1].id : sessions[0].id : null);
    }
  };

  const handleStopGeneration = () => {
    // In a real app, we'd abort the stream. For now, we'll just stop loading.
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-white text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white">
      {isSidebarOpen && (
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={setCurrentSessionId}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
      )}
      
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-14 border-b border-[#eee] flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#1a1a1a] rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full opacity-80" />
              </div>
              <h2 className="text-sm font-semibold tracking-tight uppercase">Nova AI</h2>
              <span className="px-1.5 py-0.5 bg-[#f0f0f0] text-[#888] text-[10px] font-bold rounded uppercase tracking-wider">Pro</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-[10px] items-center gap-2 hidden sm:flex bg-[#f9f9f9] px-3 py-1.5 rounded-full border border-[#eee]">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="font-bold text-[#888] uppercase tracking-wider">System Operational</span>
            </div>
          </div>
        </header>

        <ChatWindow 
          messages={currentSession?.messages || []} 
          isLoading={isLoading} 
        />
        
        <ChatInput 
          onSend={handleSendMessage} 
          onStop={handleStopGeneration}
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
}

