import { Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Animated sparkles background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Sparkles className="text-yellow-300/30" size={12} />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-serif mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200"
        >
          Find your next book.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-purple-200/80 mb-10"
        >
          Reserve instantly. Track returns. Get magical recommendations.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Try: fantasy with magic, dystopian future…"
            className="w-full pl-14 pr-6 py-4 rounded-full border-2 shadow-2xl focus:outline-none focus:border-yellow-600 transition-all placeholder:text-gray-500 backdrop-blur-sm"
            style={{
              background: 'rgba(244, 232, 208, 0.95)',
              borderColor: 'rgba(201, 169, 97, 0.5)',
              color: '#2C2C2C',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
