'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Info, ChevronUp, Globe } from 'lucide-react';
import ChatBox from '@/components/ChatBox';
import Timeline from '@/components/Timeline';
import TopicCards from '@/components/TopicCards';
import { cn } from '@/lib/utils';
import { Language, translations } from '@/lib/translations';

export default function Home() {
  const [lang, setLang] = useState<Language>('hi');
  const t = translations[lang];
  
  const [selectedQuery, setSelectedQuery] = useState<string | undefined>(undefined);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleAction = (query: string) => {
    setSelectedQuery(query);
    setIsSheetOpen(false);
    // Reset query after passing to ChatBox to allow re-selection
    setTimeout(() => setSelectedQuery(undefined), 100);
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  return (
    <main className="flex flex-col lg:flex-row h-screen w-full text-text-primary overflow-hidden font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 bg-bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center space-x-2">
          <motion.div 
            className="w-8 h-8 text-accent-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <AshokaChakraIcon />
          </motion.div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-accent-saffron via-text-primary to-accent-green bg-clip-text text-transparent">
            {t.appName}
          </h1>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={toggleLang}
            className="p-2 flex items-center space-x-1 hover:bg-bg-card rounded-full transition-colors text-xs font-bold text-accent-saffron"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? 'HI' : 'EN'}</span>
          </button>
          <button 
            onClick={() => setIsSheetOpen(true)}
            className="p-2 hover:bg-bg-card rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-accent-saffron" />
          </button>
        </div>
      </header>

      {/* Desktop Left Panel (38%) */}
      <motion.section 
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex flex-col w-[38%] h-full border-r border-border bg-bg-surface overflow-y-auto custom-scrollbar z-10"
      >
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-16 h-16 text-accent-gold flex items-center justify-center bg-accent-gold/10 rounded-full p-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <AshokaChakraIcon />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">{t.appName}</h1>
                <p className="text-accent-saffron font-medium">{t.taglineDevanagari}</p>
              </div>
            </div>
            <button 
              onClick={toggleLang}
              className="flex items-center space-x-2 px-3 py-1.5 border border-border hover:border-accent-gold rounded-full transition-all text-xs font-bold premium-glow"
            >
              <Globe className="w-4 h-4 text-accent-gold" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">{t.timelineTitle}</h2>
            <Timeline steps={t.steps} onSelectStep={handleAction} />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">{t.topicsTitle}</h2>
            <TopicCards topics={t.topics} onSelectTopic={handleAction} />
          </div>
        </div>
      </motion.section>

      {/* Right Panel / Chat (62% desktop, full mobile) */}
      <motion.section 
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 h-full pt-14 lg:pt-0"
      >
        <ChatBox initialMessage={selectedQuery} lang={lang} />
      </motion.section>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-bg-card rounded-t-[32px] border-t border-border max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-center p-3">
                <div className="w-12 h-1.5 bg-border rounded-full" />
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 px-2">{t.timelineTitle}</h3>
                  <Timeline steps={t.steps} onSelectStep={handleAction} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 px-2">{t.topicsTitle}</h3>
                  <TopicCards topics={t.topics} onSelectTopic={handleAction} />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-bg-surface">
                <button 
                  onClick={() => setIsSheetOpen(false)}
                  className="w-full py-3 bg-accent-saffron text-white font-bold rounded-2xl"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function AshokaChakraIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="2">
      <circle cx="50" cy="50" r="42" strokeWidth="3" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      {[...Array(24)].map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={(50 + 42 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(4)}
          y2={(50 + 42 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(4)}
        />
      ))}
      <circle cx="50" cy="50" r="46" strokeWidth="1" strokeDasharray="2 4" className="opacity-30" />
    </svg>
  );
}
