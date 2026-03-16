import { motion } from "motion/react";
import { bookQuotes } from "@/app/data/mock-data";
import { useEffect, useState } from "react";

export function BookQuote() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % bookQuotes.length);
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const quote = bookQuotes[currentQuote];

  return (
    <motion.div
      key={currentQuote}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-8 shadow-2xl backdrop-blur-lg"
      style={{
        background: 'rgba(244, 232, 208, 0.15)',
        border: '1px solid rgba(201, 169, 97, 0.4)',
      }}
    >
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <div className="text-5xl text-yellow-300 mb-4 opacity-70">\"</div>
        <p className="text-lg text-purple-100 italic mb-4 leading-relaxed">
          {quote.text}
        </p>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-yellow-200">— {quote.author}</p>
          {quote.book && (
            <p className="text-xs text-purple-200/70">{quote.book}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}