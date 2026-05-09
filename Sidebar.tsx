import React from 'react';
import { Plus, MessageSquare, Trash2, Settings2 } from 'lucide-react';
import { ChatSession } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession
}) => {
  return (
    <div className="w-80 h-full bg-[#fafafa] border-r border-[#e5e5e5] flex flex-col">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f5] transition-all group"
        >
          <span className="font-medium text-sm text-[#1a1a1a]">New Conversation</span>
          <Plus className="w-4 h-4 text-[#888] group-hover:text-[#1a1a1a]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#999]">History</span>
        </div>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer",
              currentSessionId === session.id 
                ? "bg-white shadow-sm ring-1 ring-[#00000008] border border-[#eee]" 
                : "hover:bg-[#f0f0f0] text-[#666]"
            )}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageSquare className={cn(
              "w-4 h-4",
              currentSessionId === session.id ? "text-[#1a1a1a]" : "text-[#aaa]"
            )} />
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm font-medium truncate",
                currentSessionId === session.id ? "text-[#1a1a1a]" : "text-[#666]"
              )}>
                {session.title || "Untitled Chat"}
              </div>
              <div className="text-[10px] opacity-60">
                {format(session.updatedAt, 'MMM d, h:mm a')}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#eee]">
        <div className="flex items-center gap-3 px-3 py-2 text-[#888] hover:text-[#1a1a1a] cursor-pointer transition-colors">
          <Settings2 className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>
    </div>
  );
};
