import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  id: number;
  label: string;
  description: string;
  query: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  onSelectStep: (query: string) => void;
  currentStep?: number;
}

const Timeline = React.memo(function Timeline({ steps, onSelectStep, currentStep = 1 }: TimelineProps) {
  return (
    <nav aria-label="Election timeline steps" className="relative w-full max-w-full overflow-hidden p-4 lg:p-6">
      {/* Desktop Vertical Timeline */}
      <div className="hidden lg:flex flex-col space-y-8 relative">
        <motion.div 
          className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        
        <ol className="space-y-8">
          {steps.map((step, index) => (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-start space-x-6 relative z-10"
            >
              <motion.button
                onClick={() => onSelectStep(step.query)}
                aria-label={`Step ${step.id}: ${step.label} - ${step.description}`}
                aria-current={step.id === currentStep ? "step" : undefined}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectStep(step.query)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                  step.id < currentStep ? "bg-accent-green border-accent-green" : 
                  step.id === currentStep ? "bg-accent-saffron border-accent-saffron shadow-[0_0_15px_rgba(255,153,51,0.5)] animate-pulse" : 
                  "bg-bg-card border-border text-text-muted"
                )}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={cn(
                    "text-sm font-bold",
                    step.id === currentStep ? "text-white" : "text-text-muted"
                  )}>
                    {step.id}
                  </span>
                )}
              </motion.button>
              
              <div className="flex flex-col text-left">
                <h3 className={cn(
                  "text-base font-semibold",
                  step.id === currentStep ? "text-accent-saffron" : "text-text-primary"
                )}>
                  {step.label}
                </h3>
                <p className="text-xs text-text-muted">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Mobile Horizontal Timeline */}
      <ol className="flex lg:hidden overflow-x-auto pb-4 space-x-4 snap-x snap-mandatory no-scrollbar">
        {steps.map((step) => (
          <li key={step.id} className="flex-shrink-0">
            <motion.button
              onClick={() => onSelectStep(step.query)}
              aria-label={`Step ${step.id}: ${step.label}`}
              aria-current={step.id === currentStep ? "step" : undefined}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectStep(step.query)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full snap-start border transition-all",
                step.id === currentStep ? "bg-accent-saffron border-accent-saffron text-white" : 
                step.id < currentStep ? "bg-accent-green/20 border-accent-green/50 text-accent-green" :
                "bg-bg-card border-border text-text-muted"
              )}
            >
              <span className="text-xs font-bold">{step.id}</span>
              <span className="text-sm font-medium whitespace-nowrap">{step.label}</span>
            </motion.button>
          </li>
        ))}
      </ol>
    </nav>
  );
});

export default Timeline;
