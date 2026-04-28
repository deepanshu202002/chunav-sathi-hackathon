import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, ArrowRight, Database } from 'lucide-react';
import { Message, streamChat } from '@/lib/api';
import TypingIndicator from './TypingIndicator';
import { cn } from '@/lib/utils';
import { Language, translations } from '@/lib/translations';

interface ChatBoxProps {
  initialMessage?: string;
  lang?: Language;
}

export default function ChatBox({ initialMessage, lang = 'en' }: ChatBoxProps) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sessionId, setSessionId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(`session_${Math.random().toString(36).slice(2, 9)}`);
  }, []);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    setIsStreaming(true);
    setStreamingText('');

    let currentResponse = '';
    streamChat(
      [...messages, userMessage],
      sessionId,
      lang,
      (chunk) => {
        currentResponse += chunk;
        setStreamingText(currentResponse);
      },
      () => {
        const botMessage: Message = { role: 'assistant', content: currentResponse };
        setMessages(prev => [...prev, botMessage]);
        setStreamingText('');
        setIsStreaming(false);
      },
      (error) => {
        console.error("Chat Error:", error);
        setIsStreaming(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] animate-[spin_60s_linear_infinite]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={(50 + 45 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(4)}
              y2={(50 + 45 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(4)}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 relative z-10 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && !isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className="bg-bg-card p-6 rounded-2xl border border-border max-w-md">
                <h3 className="text-xl font-bold text-accent-saffron mb-2">{t.namaste}</h3>
                <p className="text-text-muted">{t.intro}</p>
              </div>
              <div className="grid gap-3 w-full max-w-md">
                {t.starterPrompts.map((prompt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(prompt)}
                    className="flex items-center justify-between p-4 bg-bg-card border border-border rounded-xl text-left hover:border-accent-saffron group transition-all"
                  >
                    <span className="text-sm font-medium">{prompt}</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-saffron" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex items-end space-x-2 max-w-[92%] lg:max-w-[75%]",
                msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                  msg.role === 'user' ? "bg-accent-saffron border-accent-saffron" : "bg-bg-card border-accent-gold/30"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-accent-gold" />}
                </div>
                <div className={cn(
                  "p-3 lg:p-4 rounded-2xl text-sm lg:text-base shadow-lg",
                  msg.role === 'user' 
                    ? "user-bubble text-white rounded-br-none" 
                    : "bot-bubble text-text-primary rounded-bl-none border border-border"
                )}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full"
            >
              <div className="flex items-end space-x-2 max-w-[92%] lg:max-w-[75%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-bg-card border-accent-gold/30 overflow-hidden">
                  <motion.div 
                    className="w-full h-full flex items-center justify-center text-accent-gold"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 100 100" className="w-6 h-6">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                      {[...Array(24)].map((_, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1="50"
                          x2={(50 + 40 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(4)}
                          y2={(50 + 40 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(4)}
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                  </motion.div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="p-3 lg:p-4 rounded-2xl bot-bubble text-text-primary rounded-bl-none border border-border shadow-lg">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {streamingText}
                      <span className="inline-block w-2 h-4 ml-1 bg-accent-gold animate-pulse" />
                    </p>
                  </div>
                  <TypingIndicator />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-surface border-t border-border z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-2 px-2">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-text-muted">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]"
            />
            <span>{t.syncActive}</span>
          </div>
          <div className="text-[10px] text-text-muted">
            {t.session}: <span className="font-mono">{sessionId ? sessionId.split('_')[1] : '...'}</span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto relative flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder={t.askPlaceholder + (lang === 'en' ? ' ' + t.askPlaceholderHi : '')}
            className="flex-1 bg-bg-card border border-border rounded-2xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-saffron resize-none transition-all"
            style={{ maxHeight: '150px' }}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isStreaming}
            className="p-3 bg-accent-saffron text-white rounded-2xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
