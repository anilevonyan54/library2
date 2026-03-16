import { motion } from "motion/react";
import { Book } from "@/app/data/mock-data";
import { CheckCircle, AlertCircle, Sparkles } from "lucide-react";

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  onReserve: (book: Book) => void;
}

export function BookCard({ book, onViewDetails, onReserve }: BookCardProps) {
  const isAvailable = book.available > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(201, 169, 97, 0.4)" }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl shadow-lg overflow-hidden cursor-pointer backdrop-blur-md"
      style={{
        background: 'rgba(244, 232, 208, 0.95)',
        border: '1px solid rgba(201, 169, 97, 0.5)',
      }}
    >
      {/* Book Cover */}
      <div
        className="h-48 relative"
        style={{ backgroundColor: book.coverColor }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-6xl font-serif">📖</div>
        </div>
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {isAvailable ? (
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md"
              style={{ background: 'rgba(201, 169, 97, 0.95)' }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                {book.available} available
              </span>
            </div>
          ) : (
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md"
              style={{ background: 'rgba(139, 69, 69, 0.95)' }}
            >
              <AlertCircle className="w-4 h-4 text-yellow-200" />
              <span className="text-sm font-medium text-yellow-200">
                0 available – queue
              </span>
            </div>
          )}
        </div>
        {/* Magical sparkle effect on hover */}
        <motion.div
          className="absolute top-2 left-2"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Sparkles className="w-5 h-5 text-yellow-300/50" />
        </motion.div>
      </div>

      {/* Book Info */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-serif text-xl text-gray-900 mb-1 line-clamp-2">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-600 mb-3">{book.author}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full"
              style={{
                background: 'rgba(139, 107, 71, 0.2)',
                color: '#5A4A31',
                border: '1px solid rgba(139, 107, 71, 0.3)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => onViewDetails(book)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
            style={{
              background: 'transparent',
              border: '2px solid #8B6B47',
              color: '#5A4A31',
            }}
          >
            View
          </motion.button>
          <motion.button
            onClick={() => onReserve(book)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            style={{
              background: 'linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)',
            }}
          >
            Reserve
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}