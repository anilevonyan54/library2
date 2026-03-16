import { motion } from "motion/react";
import { Heart, Sparkles, TrendingUp } from "lucide-react";
import { Book } from "@/app/data/mock-data";
import { BookCard } from "./book-card";
import { useAuth } from "@/app/context/auth-context";
import { apiFetch } from "@/app/api/client";
import { mapApiBookToUiBook, type ApiBook } from "@/app/lib/book-mapper";
import { useEffect, useState } from "react";

interface RecommendationsPageProps {
  onViewDetails: (book: Book) => void;
  onReserve: (book: Book) => void;
  books: Book[];
}

export function RecommendationsPage({
  onViewDetails,
  onReserve,
  books,
}: RecommendationsPageProps) {
  const { token } = useAuth();
  const [recommended, setRecommended] = useState<Book[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const apiBooks = await apiFetch<ApiBook[]>("/api/nlp/recommendations/me", {
          token: token || undefined,
        });
        setRecommended(apiBooks.map(mapApiBookToUiBook));
      } catch {
        setRecommended([]);
      }
    })();
  }, [token]);

  const availableNow = books.filter((book) => book.available > 0).slice(0, 4);
  const similar = recommended.slice(0, 4);
  const popularBooks = books.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Sparkles className="w-8 h-8 text-[color:var(--gold)]" />
          <h1 className="font-serif text-4xl text-foreground">
            Recommended for You
          </h1>
          <Sparkles className="w-8 h-8 text-[color:var(--gold)]" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your recent reservations and reading history, here are some
          books we think you'll love.
        </p>
      </div>

      {/* Available Now Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h2 className="font-serif text-3xl text-foreground">Available Now</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 italic">
          ✨ Ready to borrow — These books are waiting for you on the shelf!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableNow.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard
                book={book}
                onViewDetails={onViewDetails}
                onReserve={onReserve}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Similar to Your Favorites Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-7 h-7 text-secondary" />
          <h2 className="font-serif text-3xl text-foreground">
            Similar to What You Reserved
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 italic">
          📚 Based on tags match — You enjoyed fantasy and sci-fi before
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {similar.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard
                book={book}
                onViewDetails={onViewDetails}
                onReserve={onReserve}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular in Your Favorite Genres */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-7 h-7 text-accent" />
          <h2 className="font-serif text-3xl text-foreground">
            Popular in Your Favorite Genres
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 italic">
          🔥 Trending among readers with similar tastes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard
                book={book}
                onViewDetails={onViewDetails}
                onReserve={onReserve}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommendation Note */}
      <div className="mt-12 text-center">
        <div className="inline-block bg-white/70 rounded-2xl px-8 py-4 shadow-sm border border-[rgba(45,45,45,0.05)]">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium">Pro tip:</span> The more books you
            reserve and read, the better our recommendations become!
          </p>
        </div>
      </div>
    </div>
  );
}