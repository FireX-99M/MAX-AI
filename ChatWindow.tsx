import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageItem } from './MessageItem';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
        <div className="w-16 h-16 bg-[#1a1a1a] rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-black/10">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a] mb-3">
          How can I help you today?
        </h1>
        <p className="text-[#888] max-w-sm leading-relaxed text-sm">
          Nova AI is here to help you draft emails, write code, or just explore new ideas.
        </p>
        
        <div className="grid grid-cols-2 gap-3 mt-12 w-full max-w-md">
          {[
            { tag: "Creative", title: "Write a poem about space" },
            { tag: "Logic", title: "Explain quantum physics" },
            { tag: "Code", title: "Modern React patterns" },
            { tag: "Travel", title: "Itinerary for Kyoto" }
          ].map((suggestion, i) => (
            <button
              key={i}
              className="p-4 text-left border border-[#e5e5e5] rounded-2xl hover:bg-[#fafafa] transition-all group"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1 group-hover:text-[#1a1a1a] transition-colors">
                {suggestion.tag}
              </div>
              <div className="text-sm font-medium text-[#666] group-hover:text-[#1a1a1a] transition-colors line-clamp-1">
                {suggestion.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto scroll-smooth py-8 px-4 sm:px-6"
    >
      <div className="max-w-3xl mx-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 px-1"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#e5e5e5] shadow-sm flex items-center justify-center mt-1">
              <Sparkles className="w-4 h-4 text-[#1a1a1a] animate-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center mt-2">
                <div className="w-1.5 h-1.5 bg-[#ddd] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-[#ddd] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-[#ddd] rounded-full animate-bounce"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
