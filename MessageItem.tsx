import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { User, Sparkles } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-8",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] sm:max-w-[75%] gap-4 px-1",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
          isUser ? "bg-[#1a1a1a]" : "bg-white border border-[#e5e5e5] shadow-sm"
        )}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#1a1a1a]" />
          )}
        </div>
        
        <div className={cn(
          "flex flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "px-5 py-3 rounded-2xl text-sm leading-relaxed",
            isUser 
              ? "bg-[#1a1a1a] text-white rounded-tr-none shadow-xl shadow-black/5" 
              : "bg-white border border-[#f0f0f0] text-[#222] rounded-tl-none shadow-sm"
          )}>
            <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-[#1a1a1a] prose-pre:text-white prose-code:text-[#1a1a1a] prose-code:bg-[#f5f5f5] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
          <span className="text-[10px] text-[#aaa] font-medium mt-1 uppercase tracking-wider">
            {isUser ? "You" : "Nova AI"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
