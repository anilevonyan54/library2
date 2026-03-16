import { motion } from "motion/react";
import { X, BookOpen, CheckCircle, AlertCircle, Star } from "lucide-react";
import { Book, mockBooks } from "@/app/data/mock-data";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/auth-context";

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onReserve: (book: Book) => void;
  onViewDetails?: (book: Book) => void;
}

export function BookDetailModal({
  book,
  onClose,
  onReserve,
  onViewDetails,
}: BookDetailModalProps) {
  const isAvailable = book.available > 0;
  const { currentUser } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  // Get similar books (books with at least one matching tag)
  const similarBooks = mockBooks
    .filter((b) => b.id !== book.id)
    .filter((b) => b.tags.some((tag) => book.tags.includes(tag)))
    .slice(0, 4);

  const handleSubmitReview = () => {
    if (!currentUser) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Add review to book
    if (!book.reviews) {
      book.reviews = [];
    }

    book.reviews.push({
      id: `rev${book.reviews.length + 1}`,
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      comment,
      date: new Date(),
    });

    toast.success("Review submitted successfully!");
    setShowReviewForm(false);
    setComment("");
    setRating(5);
  };

  const averageRating = book.reviews && book.reviews.length > 0
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-[#FAF7F2] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all shadow-md"
        >
          <X className="w-5 h-5 text-[#2D2D2D]" />
        </button>

        <div className="p-8">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            {/* Left: Cover */}
            <div>
              <div
                className="w-full h-[400px] rounded-2xl shadow-lg flex items-center justify-center"
                style={{ backgroundColor: book.coverColor }}
              >
                <div className="text-white/20 text-8xl">📖</div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              {/* Title & Author */}
              <h2 className="font-serif text-4xl text-foreground mb-2">
                {book.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white text-muted-foreground text-sm rounded-full border border-[rgba(45,45,45,0.05)] shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-foreground leading-relaxed mb-6">
                {book.description}
              </p>

              {/* Availability Block */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(45,45,45,0.05)] mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-xl text-foreground">
                    Availability
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total copies:</span>
                    <span className="font-medium text-foreground">
                      {book.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available now:</span>
                    <div className="flex items-center gap-2">
                      {isAvailable ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="font-medium text-primary">
                            {book.available}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-[#D4A500]" />
                          <span className="font-medium text-[#D4A500]">0</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!isAvailable && (
                    <p className="text-sm text-[#D4A500] italic mt-2">
                      All copies currently on loan. Join the queue!
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onReserve(book);
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-[#3D7A3E] transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  Reserve Now
                </button>
                <button className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-[#A05A2C] transition-all duration-300 shadow-md hover:shadow-lg font-medium">
                  Borrow / Pickup
                </button>
              </div>
            </div>
          </div>

          {/* Similar Books */}
          {similarBooks.length > 0 && (
            <div className="mt-12">
              <h3 className="font-serif text-2xl text-foreground mb-6">
                If you like this, you might enjoy…
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarBooks.map((similarBook) => (
                  <div
                    key={similarBook.id}
                    onClick={() => {
                      if (onViewDetails) {
                        onViewDetails(similarBook);
                      }
                    }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div
                      className="h-32 flex items-center justify-center"
                      style={{ backgroundColor: similarBook.coverColor }}
                    >
                      <div className="text-white/20 text-4xl">📖</div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-serif text-sm text-[#2D2D2D] line-clamp-2 mb-1">
                        {similarBook.title}
                      </h4>
                      <p className="text-xs text-[#6B6B6B]">
                        {similarBook.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-12">
            <h3 className="font-serif text-2xl text-foreground mb-6">
              Reviews
            </h3>
            <div className="flex items-center gap-4 mb-4">
              {averageRating && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium ml-1">
                    {averageRating}
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-xl hover:bg-[#A05A2C] transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            </div>
            {showReviewForm && (
              <div className="bg-white rounded-xl p-4 shadow-md mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Star className="w-5 h-5 text-primary" />
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <Star
                        key={r}
                        className={`w-5 h-5 ${
                          r <= rating ? "text-primary" : "text-gray-300"
                        } cursor-pointer`}
                        onClick={() => setRating(r)}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-24 p-2 border border-gray-300 rounded-xl resize-none"
                  placeholder="Write your review here..."
                />
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-[#3D7A3E] transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  Submit Review
                </button>
              </div>
            )}
            {book.reviews && book.reviews.length > 0 ? (
              <div className="space-y-4">
                {book.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl p-4 shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <Star className="w-5 h-5 text-primary" />
                      <span className="text-primary font-medium ml-1">
                        {review.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>{review.userName}:</strong> {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}