import { motion } from "motion/react";
import {
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { mockReservations, mockLoans, mockBooks } from "@/app/data/mock-data";

export function AdminDashboard() {
  // Calculate stats
  const pendingRequests = mockReservations.filter(
    (r) => r.status === "pending"
  ).length;
  const readyForPickup = mockReservations.filter(
    (r) => r.status === "ready"
  ).length;
  const activeLoans = mockLoans.filter((l) => !l.isOverdue).length;
  const overdueLoans = mockLoans.filter((l) => l.isOverdue).length;

  // Get top pending requests
  const topPendingRequests = mockReservations
    .filter((r) => r.status === "pending")
    .slice(0, 5);

  // Get overdue loans
  const topOverdueLoans = mockLoans.filter((l) => l.isOverdue).slice(0, 5);

  // Get popular books (mock data based on availability)
  const popularBooks = mockBooks
    .map((book) => ({
      book,
      reservations: Math.floor(Math.random() * 10),
      loans: book.total - book.available,
    }))
    .sort((a, b) => b.reservations + b.loans - (a.reservations + a.loans))
    .slice(0, 5);

  const statCards = [
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      label: "Ready for Pickup",
      value: readyForPickup,
      icon: CheckCircle,
      color: "bg-green-600",
    },
    {
      label: "Active Loans",
      value: activeLoans,
      icon: BookOpen,
      color: "bg-blue-600",
    },
    {
      label: "Overdue Loans",
      value: overdueLoans,
      icon: AlertCircle,
      color: "bg-burgundy",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">Dashboard</h1>
        <p className="text-purple-200/80">
          Today's library overview and quick actions
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
              style={{
                background: 'rgba(244, 232, 208, 0.15)',
                border: '1px solid rgba(201, 169, 97, 0.4)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-3xl font-bold text-yellow-200">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-purple-200/80">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
          style={{
            background: 'rgba(244, 232, 208, 0.15)',
            border: '1px solid rgba(201, 169, 97, 0.4)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-yellow-300" size={20} />
            <h2 className="text-xl text-yellow-200">Pending Requests</h2>
          </div>
          <div className="space-y-3">
            {topPendingRequests.length > 0 ? (
              topPendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors"
                  style={{
                    background: 'rgba(244, 232, 208, 0.2)',
                  }}
                >
                  <div>
                    <p className="font-medium text-sm text-yellow-200">{request.userName}</p>
                    <p className="text-xs text-purple-200/70">
                      {request.bookTitle}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 text-white rounded text-xs transition-colors shadow-md"
                      style={{ background: '#10b981' }}
                    >
                      Approve
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 text-white rounded text-xs transition-colors shadow-md"
                      style={{ background: '#ef4444' }}
                    >
                      Deny
                    </motion.button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-purple-200/70 text-center py-4">
                No pending requests
              </p>
            )}
          </div>
        </motion.div>

        {/* Overdue Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
          style={{
            background: 'rgba(244, 232, 208, 0.15)',
            border: '1px solid rgba(201, 169, 97, 0.4)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-400" size={20} />
            <h2 className="text-xl text-yellow-200">Overdue Loans</h2>
          </div>
          <div className="space-y-3">
            {topOverdueLoans.length > 0 ? (
              topOverdueLoans.map((loan) => {
                const daysOverdue = Math.ceil(
                  (Date.now() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <div>
                      <p className="font-medium text-sm text-yellow-200">{loan.book.title}</p>
                      <p className="text-xs text-red-300">
                        {daysOverdue} days overdue
                      </p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 text-white rounded text-xs transition-colors shadow-md"
                      style={{ background: '#ef4444' }}
                    >
                      Contact
                    </motion.button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-purple-200/70 text-center py-4">
                No overdue loans
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Popular Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
        style={{
          background: 'rgba(244, 232, 208, 0.15)',
          border: '1px solid rgba(201, 169, 97, 0.4)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-yellow-300" size={20} />
          <h2 className="text-xl text-yellow-200">Popular Books (Last 7 Days)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(201, 169, 97, 0.3)' }}>
                <th className="text-left py-3 px-2 text-sm text-purple-200/80">
                  Book
                </th>
                <th className="text-left py-3 px-2 text-sm text-purple-200/80">
                  Author
                </th>
                <th className="text-center py-3 px-2 text-sm text-purple-200/80">
                  Reservations
                </th>
                <th className="text-center py-3 px-2 text-sm text-purple-200/80">
                  Loans
                </th>
              </tr>
            </thead>
            <tbody>
              {popularBooks.map((item) => (
                <tr
                  key={item.book.id}
                  className="border-b transition-colors"
                  style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}
                >
                  <td className="py-3 px-2 text-sm text-yellow-100">{item.book.title}</td>
                  <td className="py-3 px-2 text-sm text-purple-200/70">
                    {item.book.author}
                  </td>
                  <td className="py-3 px-2 text-sm text-center text-yellow-100">
                    {item.reservations}
                  </td>
                  <td className="py-3 px-2 text-sm text-center text-yellow-100">
                    {item.loans}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}