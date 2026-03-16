import { motion } from "motion/react";
import { BookOpen, Plus, Search, Sparkles } from "lucide-react";
import { mockBooks } from "@/app/data/mock-data";

export function AdminBooks() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100 flex items-center gap-2">
            Books & Inventory
            <Sparkles size={28} className="text-yellow-300" />
          </h1>
          <p className="text-purple-200/80">
            Manage your library's book collection
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 shadow-md"
          style={{
            background: 'linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)',
          }}
        >
          <Plus size={20} />
          Add New Book
        </motion.button>
      </div>

      {/* Search Bar */}
      <div 
        className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
        style={{
          background: 'rgba(244, 232, 208, 0.15)',
          border: '1px solid rgba(201, 169, 97, 0.4)',
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-yellow-600 transition-colors backdrop-blur-sm"
            style={{
              background: 'rgba(244, 232, 208, 0.95)',
              borderColor: 'rgba(201, 169, 97, 0.5)',
              color: '#2C2C2C',
            }}
          />
        </div>
      </div>

      {/* Books Table */}
      <div 
        className="rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg"
        style={{
          background: 'rgba(244, 232, 208, 0.15)',
          border: '1px solid rgba(201, 169, 97, 0.4)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead 
              className="border-b"
              style={{
                background: 'rgba(139, 107, 71, 0.2)',
                borderColor: 'rgba(201, 169, 97, 0.3)',
              }}
            >
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Title
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Author
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Genre
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-yellow-200">
                  Available
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-yellow-200">
                  Total
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-yellow-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockBooks.map((book, index) => (
                <motion.tr
                  key={book.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors"
                  style={{
                    borderColor: 'rgba(201, 169, 97, 0.2)',
                  }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-14 rounded flex items-center justify-center"
                        style={{ backgroundColor: book.coverColor }}
                      >
                        <BookOpen className="text-white/50" size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-100">{book.title}</p>
                        <p className="text-xs text-purple-200/60">
                          ID: {book.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-yellow-100">{book.author}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span 
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        background: 'rgba(139, 107, 71, 0.2)',
                        color: '#fbbf24',
                      }}
                    >
                      {book.genre}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        book.available > 0
                          ? ""
                          : ""
                      }`}
                      style={book.available > 0 ? {
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#4ade80',
                        borderColor: 'rgba(34, 197, 94, 0.3)',
                      } : {
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      {book.available}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-sm text-yellow-100">{book.total}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 text-white rounded-lg transition-colors text-sm shadow-md"
                        style={{ background: '#3b82f6' }}
                      >
                        Edit
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 text-white rounded-lg transition-colors text-sm shadow-md"
                        style={{ background: '#6b7280' }}
                      >
                        View
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
