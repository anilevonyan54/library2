import { motion } from "motion/react";
import { Book } from "@/app/data/mock-data";
import { BookCard } from "./book-card";
import { BookQuote } from "./book-quote";
import { Filter, Sparkles } from "lucide-react";

interface BookCatalogProps {
  books: Book[];
  onViewDetails: (book: Book) => void;
  onReserve: (book: Book) => void;
  selectedGenre?: string;
  onGenreChange?: (genre: string) => void;
}

export function BookCatalog({
  books,
  onViewDetails,
  onReserve,
  selectedGenre,
  onGenreChange,
}: BookCatalogProps) {
  // Get unique genres from books
  const genres = ["all", ...new Set(books.map(book => book.genre))];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Book Quote */}
      <div className="mb-12">
        <BookQuote />
      </div>

      {/* Catalog Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">
          Browse Our Collection
        </h2>
        <p className="text-purple-200/80 flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-300" />
          {books.length} {books.length === 1 ? "book" : "books"} found
        </p>
      </div>

      {/* Genre Filter */}
      {onGenreChange && (
        <div 
          className="mb-8 rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
          style={{
            background: 'rgba(244, 232, 208, 0.15)',
            border: '1px solid rgba(201, 169, 97, 0.4)',
          }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-yellow-300" />
              <span className="text-sm font-medium text-yellow-200">Genre:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => onGenreChange(genre)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedGenre === genre
                      ? "text-gray-900 shadow-lg"
                      : "text-purple-100 hover:text-white"
                  }`}
                  style={selectedGenre === genre ? {
                    background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
                  } : {
                    background: 'rgba(244, 232, 208, 0.1)',
                  }}
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <BookCard
              book={book}
              onViewDetails={onViewDetails}
              onReserve={onReserve}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {books.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-30">📚</div>
          <h3 className="font-serif text-2xl mb-2 text-yellow-200">
            No books found
          </h3>
          <p className="text-purple-200/70">
            Try adjusting your search query to find what you're looking for.
          </p>
        </div>
      )}
    </section>
  );
}