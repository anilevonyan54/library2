import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Filter, CheckCircle, AlertTriangle, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/auth-context";
import { apiFetch } from "@/app/api/client";

export function AdminLoans() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loans, setLoans] = useState<any[]>([]);
  const { token } = useAuth();

  const loadLoans = async () => {
    try {
      const res = await apiFetch<any[]>(`/api/admin/loans?status=${encodeURIComponent(filterStatus)}`, {
        token: token || undefined,
      });
      setLoans(res);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load loans");
      setLoans([]);
    }
  };

  useEffect(() => {
    loadLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filterStatus]);

  const now = Date.now();
  const enrichedLoans = useMemo(() => {
    return loans.map((l) => {
      const due = new Date(l.dueDate).getTime();
      const returnedAt = l.returnedAt ? new Date(l.returnedAt).getTime() : null;
      const isOverdue = !returnedAt && (l.status === "active" || l.status === "extended") && due < now;
      return { ...l, isOverdue, dueDateObj: new Date(l.dueDate) };
    });
  }, [loans, now]);

  const handleMarkReturned = async (id: number) => {
    try {
      await apiFetch(`/api/loans/${id}/return`, { method: "POST", token: token || undefined });
      toast.success("Book marked as returned!");
      await loadLoans();
    } catch (e: any) {
      toast.error(e?.message || "Failed to mark returned");
    }
  };

  const handleExtendDueDate = async (id: number) => {
    try {
      await apiFetch(`/api/loans/${id}/extend`, { method: "POST", token: token || undefined });
      toast.success("Due date extended by 7 days");
      await loadLoans();
    } catch (e: any) {
      toast.error(e?.message || "Failed to extend");
    }
  };

  const handleMarkLost = async (id: number) => {
    try {
      await apiFetch(`/api/loans/${id}/mark-lost`, { method: "POST", token: token || undefined });
      toast.info("Book marked as lost");
      await loadLoans();
    } catch (e: any) {
      toast.error(e?.message || "Failed to mark lost");
    }
  };

  const getDaysRemaining = (dueDate: Date) => {
    const diff = dueDate.getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100 flex items-center gap-2">
          Loans Management
          <Sparkles size={28} className="text-yellow-300" />
        </h1>
        <p className="text-purple-200/80">
          Track active loans, returns, and overdue items
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 shadow-2xl backdrop-blur-lg"
          style={{
            background: 'rgba(244, 232, 208, 0.15)',
            border: '1px solid rgba(201, 169, 97, 0.4)',
          }}
        >
          <p className="text-sm text-purple-200/70 mb-1">Active Loans</p>
          <p className="text-3xl font-bold text-yellow-200">
            {enrichedLoans.filter((l) => !l.isOverdue && (l.status === "active" || l.status === "extended")).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-6 shadow-2xl backdrop-blur-lg"
          style={{
            background: 'rgba(244, 232, 208, 0.15)',
            border: '1px solid rgba(201, 169, 97, 0.4)',
          }}
        >
          <p className="text-sm text-purple-200/70 mb-1">Overdue</p>
          <p className="text-3xl font-bold text-red-300">
            {enrichedLoans.filter((l) => l.isOverdue).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-6 shadow-2xl backdrop-blur-lg"
          style={{
            background: 'rgba(244, 232, 208, 0.15)',
            border: '1px solid rgba(201, 169, 97, 0.4)',
          }}
        >
          <p className="text-sm text-purple-200/70 mb-1">Due This Week</p>
          <p className="text-3xl font-bold text-amber-300">
            {
              enrichedLoans.filter((l) => {
                const days = getDaysRemaining(new Date(l.dueDate));
                return days >= 0 && days <= 7;
              }).length
            }
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div 
        className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
        style={{
          background: 'rgba(244, 232, 208, 0.15)',
          border: '1px solid rgba(201, 169, 97, 0.4)',
        }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-yellow-300" />
            <span className="text-sm font-medium text-yellow-200">Filter:</span>
          </div>
          <div className="flex gap-2">
            {["all", "active", "overdue"].map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterStatus === status
                    ? "text-gray-900 shadow-lg"
                    : "text-purple-100 hover:text-white"
                }`}
                style={filterStatus === status ? {
                  background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
                } : {
                  background: 'rgba(244, 232, 208, 0.1)',
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Loans Table */}
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
                  Loan ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Book
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Borrowed
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Due Date
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-yellow-200">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-yellow-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {enrichedLoans.map((loan, index) => {
                const daysRemaining = getDaysRemaining(new Date(loan.dueDate));
                return (
                  <motion.tr
                    key={loan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors"
                    style={{
                      borderColor: 'rgba(201, 169, 97, 0.2)',
                      background: loan.isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    }}
                  >
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono text-purple-200/70">
                        #{loan.id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-yellow-100">{loan.bookTitle}</p>
                        <p className="text-xs text-purple-200/60">
                          {loan.bookAuthor}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-yellow-100">{loan.userName}</p>
                        <p className="text-xs text-purple-200/60">{loan.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-purple-200/70">
                        {loan.borrowedAt ? formatDate(new Date(loan.borrowedAt)) : "-"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-purple-200/70">
                        {formatDate(new Date(loan.dueDate))}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        {loan.isOverdue ? (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border"
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            <AlertTriangle size={12} />
                            {Math.abs(daysRemaining)} days overdue
                          </span>
                        ) : daysRemaining <= 2 ? (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border"
                            style={{
                              background: 'rgba(245, 158, 11, 0.2)',
                              color: '#fbbf24',
                              borderColor: 'rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            <Calendar size={12} />
                            Due in {daysRemaining} day{daysRemaining !== 1 && "s"}
                          </span>
                        ) : (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border"
                            style={{
                              background: 'rgba(34, 197, 94, 0.2)',
                              color: '#4ade80',
                              borderColor: 'rgba(34, 197, 94, 0.3)',
                            }}
                          >
                            <CheckCircle size={12} />
                            {loan.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          onClick={() => handleMarkReturned(Number(loan.id))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-white rounded-lg transition-colors text-sm shadow-md"
                          style={{ background: '#10b981' }}
                        >
                          Mark Returned
                        </motion.button>
                        <motion.button
                          onClick={() => handleExtendDueDate(Number(loan.id))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-white rounded-lg transition-colors text-sm shadow-md"
                          style={{ background: '#3b82f6' }}
                        >
                          Extend
                        </motion.button>
                        <motion.button
                          onClick={() => handleMarkLost(Number(loan.id))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-white rounded-lg transition-colors text-sm shadow-md"
                          style={{ background: '#6b7280' }}
                        >
                          Lost
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {enrichedLoans.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-purple-200/70">
                No loans found with the selected filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
