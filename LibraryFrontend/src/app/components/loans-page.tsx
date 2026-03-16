import { motion } from "motion/react";
import { Clock, CheckCircle, Calendar } from "lucide-react";
import { mockReturnedLoans } from "@/app/data/mock-data";
import { useAuth } from "@/app/context/auth-context";
import { apiFetch } from "@/app/api/client";
import { useEffect, useState } from "react";
import type { ApiBook } from "@/app/lib/book-mapper";
import { mapApiBookToUiBook } from "@/app/lib/book-mapper";

export function LoansPage() {
  const { token } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<any[]>("/api/reservations/me", { token: token || undefined });
        setPending(res.filter((r) => r.status === "pending"));
        setApproved(res.filter((r) => r.status === "approved"));
      } catch {
        setPending([]);
        setApproved([]);
      }
    })();
  }, [token]);

  const getDaysLeft = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl text-foreground mb-2">My Personal Shelf</h1>
        <p className="text-muted-foreground">Keep track of your reading journey</p>
      </div>

      {/* Pending Approval */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl text-foreground mb-6 flex items-center gap-3">
          <Clock className="w-7 h-7 text-primary" />
          Pending Approval
        </h2>

        <div className="space-y-4">
          {pending.map((r, index) => {
            const book = r.book ? mapApiBookToUiBook(r.book as ApiBook) : null;
            if (!book) return null;

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md border border-[rgba(45,45,45,0.05)] overflow-hidden"
              >
                <div className="flex items-center gap-6 p-6">
                  <div
                    className="w-24 h-32 rounded-lg shadow-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <div className="text-white/20 text-4xl">📖</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-foreground mb-1">{book.title}</h3>
                    <p className="text-muted-foreground mb-2">{book.author}</p>
                    <p className="text-sm text-muted-foreground italic">Waiting for admin approval.</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {pending.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md border border-[rgba(45,45,45,0.05)] p-6 text-muted-foreground">
              No pending reservations.
            </div>
          )}
        </div>
      </section>

      {/* Approved Reservations */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl text-foreground mb-6 flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-primary" />
          Approved Reservations
        </h2>

        <div className="space-y-4">
          {approved.map((r, index) => {
            const book = r.book ? mapApiBookToUiBook(r.book as ApiBook) : null;
            if (!book) return null;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md border border-[rgba(45,45,45,0.05)] overflow-hidden"
              >
                <div className="flex items-center gap-6 p-6">
                  <div
                    className="w-24 h-32 rounded-lg shadow-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <div className="text-white/20 text-4xl">📖</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-foreground mb-1">{book.title}</h3>
                    <p className="text-muted-foreground mb-2">{book.author}</p>
                    <p className="text-sm text-muted-foreground italic">
                      Approved{r.pickupDeadline ? ` — pickup before ${new Date(r.pickupDeadline).toLocaleString()}` : ""}.
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {approved.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md border border-[rgba(45,45,45,0.05)] p-6 text-muted-foreground">
              No approved reservations yet.
            </div>
          )}
        </div>
      </section>

      {/* Currently Reading Section */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl text-foreground mb-6 flex items-center gap-3">
          <Clock className="w-7 h-7 text-primary" />
          Currently Reading
        </h2>

        <div className="space-y-4">
          {/* TODO: Wire real loans from backend */}
          {([] as any[]).map((loan, index) => {
            const daysLeft = getDaysLeft(loan.dueDate);
            const isOverdue = loan.isOverdue;
            const isCloseToDue = daysLeft <= 3 && daysLeft > 0;

            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-[rgba(45,45,45,0.05)] overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Book Cover */}
                  <div
                    className="w-24 h-32 rounded-lg shadow-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: loan.book.coverColor }}
                  >
                    <div className="text-white/20 text-4xl">📖</div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-foreground mb-1">
                      {loan.book.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">{loan.book.author}</p>

                    {/* Due Date Info */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Due: {formatDate(loan.dueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Deadline Indicator */}
                  <div className="flex flex-col items-end gap-3">
                    {isOverdue ? (
                      <div className="bg-red-50 border-2 border-red-300 rounded-xl px-6 py-3 text-center">
                        <p className="text-sm text-red-600 font-medium mb-1">
                          OVERDUE
                        </p>
                        <p className="text-xs text-red-500">
                          {Math.abs(daysLeft)} days late
                        </p>
                      </div>
                    ) : isCloseToDue ? (
                      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-6 py-3 text-center">
                        <p className="text-sm text-amber-600 font-medium mb-1">
                          DUE SOON
                        </p>
                        <p className="text-xs text-amber-500">
                          {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-50 border-2 border-green-300 rounded-xl px-6 py-3 text-center">
                        <p className="text-sm text-green-600 font-medium mb-1">
                          Days left
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {daysLeft}
                        </p>
                      </div>
                    )}

                    {/* Return Button */}
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-[#3D7A3E] transition-all duration-300 shadow-sm hover:shadow-md font-medium">
                      Return
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* History Section */}
      <section>
        <h2 className="font-serif text-3xl text-foreground mb-6 flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-primary" />
          Reading History
        </h2>

        <div className="bg-white rounded-2xl shadow-md border border-[rgba(45,45,45,0.05)] overflow-hidden">
          <div className="divide-y divide-[rgba(45,45,45,0.05)]">
            {mockReturnedLoans.map((returned, index) => (
              <motion.div
                key={returned.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 hover:bg-[#F9F9F9] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-16 rounded shadow-sm flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: returned.book.coverColor }}
                    >
                      <div className="text-white/30 text-xl">📖</div>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-foreground">
                        {returned.book.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {returned.book.author}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Returned</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(returned.returnedDate)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}