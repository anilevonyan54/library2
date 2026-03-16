import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  User as UserIcon,
  Award,
  AlertCircle,
  BookOpen,
  X,
  Sparkles,
} from "lucide-react";
import {
  mockUsers,
  mockAdminNotes,
  mockUserStats,
  User,
  AdminNote,
} from "@/app/data/mock-data";
import { toast } from "sonner";

export function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState<
    "excellent" | "good" | "warning" | "bad"
  >("good");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewTags, setReviewTags] = useState<string[]>([]);

  const handleAddReview = () => {
    if (!selectedUser || !reviewNote.trim()) {
      toast.error("Please enter a review note");
      return;
    }

    const newReview: AdminNote = {
      id: `an${mockAdminNotes.length + 1}`,
      userId: selectedUser.id,
      adminId: "u3", // Current admin
      loanId: "l1", // Mock loan ID
      rating: reviewRating,
      note: reviewNote,
      tags: reviewTags,
      date: new Date(),
    };

    mockAdminNotes.push(newReview);
    toast.success("Review added successfully!");
    setShowReviewModal(false);
    setReviewNote("");
    setReviewTags([]);
    setReviewRating("good");
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-burgundy";
  };

  const getReliabilityLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  const regularUsers = mockUsers.filter((u) => u.role === "user");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100 flex items-center gap-2">
          User Management
          <Sparkles size={28} className="text-yellow-300" />
        </h1>
        <p className="text-purple-200/80">
          View user profiles, history, and add admin reviews
        </p>
      </div>

      {/* Search Bar */}
      <div
        className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
        style={{
          background: "rgba(244, 232, 208, 0.15)",
          border: "1px solid rgba(201, 169, 97, 0.4)",
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-yellow-600 transition-colors backdrop-blur-sm"
            style={{
              background: "rgba(244, 232, 208, 0.95)",
              borderColor: "rgba(201, 169, 97, 0.5)",
              color: "#2C2C2C",
            }}
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularUsers.map((user, index) => {
          const stats = mockUserStats[index % mockUserStats.length];
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg cursor-pointer transition-shadow"
              style={{
                background: "rgba(244, 232, 208, 0.15)",
                border: "1px solid rgba(201, 169, 97, 0.4)",
              }}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)",
                    }}
                  >
                    <UserIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-yellow-100">{user.name}</h3>
                    <p className="text-xs text-purple-200/60">{user.email}</p>
                  </div>
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getReliabilityColor(
                  stats.reliabilityScore
                )} bg-current/10`}
              >
                <Award size={14} />
                {getReliabilityLabel(stats.reliabilityScore)} (
                {stats.reliabilityScore})
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-purple-200/60">Total Loans</p>
                  <p className="font-medium text-yellow-100">{stats.totalLoans}</p>
                </div>
                <div>
                  <p className="text-purple-200/60">Late Returns</p>
                  <p className="font-medium text-yellow-100">
                    {stats.lateReturns}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-lg"
            style={{
              background: "rgba(244, 232, 208, 0.98)",
              border: "1px solid rgba(201, 169, 97, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 border-b p-6 flex items-center justify-between"
              style={{
                background: "rgba(244, 232, 208, 0.98)",
                borderColor: "rgba(201, 169, 97, 0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)",
                  }}
                >
                  <UserIcon className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedUser.name}
                  </h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              <motion.button
                onClick={() => setSelectedUser(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-yellow-600/20 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </motion.button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Stats */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-gray-800">
                  <Award className="text-yellow-700" size={20} />
                  User Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Loans", value: 5 },
                    { label: "Late Returns", value: 1 },
                    { label: "Avg Delay", value: "1.2 days" },
                    { label: "Cancellations", value: 0 },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg p-4"
                      style={{
                        background: "rgba(139, 107, 71, 0.15)",
                      }}
                    >
                      <p className="text-sm text-gray-600 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes/Reviews */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium flex items-center gap-2 text-gray-800">
                    <BookOpen className="text-yellow-700" size={20} />
                    Admin Reviews
                  </h3>
                  <motion.button
                    onClick={() => setShowReviewModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-white rounded-lg transition-colors text-sm shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)",
                    }}
                  >
                    Add Review
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {mockAdminNotes
                    .filter((note) => note.userId === selectedUser.id)
                    .map((note) => (
                      <div
                        key={note.id}
                        className="rounded-lg p-4 border-l-4"
                        style={{
                          background: "rgba(139, 107, 71, 0.15)",
                          borderColor: "#8B6B47",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              note.rating === "excellent"
                                ? "bg-green-100 text-green-800"
                                : note.rating === "good"
                                ? "bg-blue-100 text-blue-800"
                                : note.rating === "warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {note.rating.charAt(0).toUpperCase() +
                              note.rating.slice(1)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {note.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-2 text-gray-800">{note.note}</p>
                        <div className="flex gap-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                background: "rgba(139, 107, 71, 0.2)",
                                color: "#5A4A31",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Review Modal */}
      {showReviewModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowReviewModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl shadow-2xl max-w-md w-full p-6"
            style={{
              background: "rgba(244, 232, 208, 0.98)",
              border: "1px solid rgba(201, 169, 97, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add Admin Review
            </h3>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-700">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) =>
                  setReviewRating(
                    e.target.value as "excellent" | "good" | "warning" | "bad"
                  )
                }
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-yellow-600"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderColor: "rgba(139, 107, 71, 0.3)",
                  color: "#2C2C2C",
                }}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="bad">Bad</option>
              </select>
            </div>

            {/* Note */}
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-700">Note</label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-yellow-600 resize-none"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  borderColor: "rgba(139, 107, 71, 0.3)",
                  color: "#2C2C2C",
                }}
                rows={4}
                placeholder="Add your review note..."
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2">
                {["on time", "late", "damaged", "perfect condition"].map(
                  (tag) => (
                    <motion.button
                      key={tag}
                      onClick={() =>
                        setReviewTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        reviewTags.includes(tag)
                          ? "text-white shadow-md"
                          : "hover:bg-yellow-600/20"
                      }`}
                      style={
                        reviewTags.includes(tag)
                          ? {
                              background:
                                "linear-gradient(135deg, #8B6B47 0%, #C9A961 100%)",
                            }
                          : {
                              background: "rgba(139, 107, 71, 0.15)",
                              color: "#5A4A31",
                            }
                      }
                    >
                      {tag}
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleAddReview}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 text-white rounded-lg transition-colors shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)",
                }}
              >
                Save Review
              </motion.button>
              <motion.button
                onClick={() => setShowReviewModal(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-lg transition-colors"
                style={{
                  background: "rgba(139, 107, 71, 0.15)",
                  color: "#5A4A31",
                }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}