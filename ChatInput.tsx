import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-white/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto relative">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-[#f8f8f8] border border-[#e5e5e5] rounded-2xl p-2 focus-within:ring-2 focus-within:ring-[#00000008] focus-within:border-[#ddd] transition-all"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-sm max-h-[200px] scrollbar-hide text-[#1a1a1a] placeholder-[#999]"
          />
          
          <div className="flex gap-2 p-1">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.button
                  key="stop"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  type="button"
                  onClick={onStop}
                  className="p-3 bg-[#1a1a1a] text-white rounded-xl hover:bg-[#333] transition-colors"
                >
                  <StopCircle className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  disabled={!input.trim()}
                  type="submit"
                  className="p-3 bg-[#1a1a1a] text-white rounded-xl hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                >
                  <SendHorizonal className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>
        <div className="mt-2 text-center text-[10px] text-[#aaa] font-medium tracking-wide flex items-center justify-center gap-1">
          Nova AI can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};
