import { motion } from 'framer-motion';

export interface Topic {
  id: number;
  title: string;
  query: string;
}

interface TopicCardsProps {
  topics: Topic[];
  onSelectTopic: (query: string) => void;
}

export default function TopicCards({ topics, onSelectTopic }: TopicCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4 p-2 lg:p-4">
      {topics.map((topic, index) => (
        <motion.button
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.07 }}
          whileHover={{ 
            y: -4, 
            scale: 1.02,
            boxShadow: '0 0 15px rgba(255, 153, 51, 0.3)',
            borderColor: 'var(--accent-saffron)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectTopic(topic.query)}
          className="flex flex-col items-start p-3 lg:p-4 bg-bg-card border border-border rounded-xl text-left transition-colors hover:border-accent-saffron group"
        >
          <span className="text-sm lg:text-base font-medium text-text-primary group-hover:text-accent-saffron transition-colors">
            {topic.title}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
