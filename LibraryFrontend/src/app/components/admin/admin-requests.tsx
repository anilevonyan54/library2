import { useState } from "react";
import { motion } from "motion/react";
import { Filter, CheckCircle, XCircle, Eye, Clock, Sparkles } from "lucide-react";
import { mockReservations, Reservation } from "@/app/data/mock-data";
import { toast } from "sonner";

export function AdminRequests() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reservations, setReservations] = useState(mockReservations);

  const filteredRequests =
    statusFilter === "all"
      ? reservations
      : reservations.filter((r) => r.status === statusFilter);

  const handleApprove = (id: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "ready" as const,
              pickupDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            }
          : r
      )
    );
    toast.success("Request approved! User notified.");
  };

  const handleDeny = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "denied" as const } : r))
    );
    toast.info("Request denied.");
  };

  const handleConfirmPickup = (id: string) => {
    toast.success("Loan created! Book checked out.");
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const getStatusBadge = (status: Reservation["status"]) => {
    const styles = {
      pending: { bg: "rgba(245, 158, 11, 0.2)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
      approved: { bg: "rgba(59, 130, 246, 0.2)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
      ready: { bg: "rgba(34, 197, 94, 0.2)", text: "#4ade80", border: "rgba(34, 197, 94, 0.3)" },
      denied: { bg: "rgba(239, 68, 68, 0.2)", text: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
      expired: { bg: "rgba(156, 163, 175, 0.2)", text: "#9ca3af", border: "rgba(156, 163, 175, 0.3)" },
    };

    const style = styles[status];

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium border"
        style={{
          background: style.bg,
          color: style.text,
          borderColor: style.border,
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100 flex items-center gap-2">
          Requests Management
          <Sparkles size={28} className="text-yellow-300" />
        </h1>
        <p className="text-purple-200/80">
          Approve, deny, and manage book reservations
        </p>
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
            <span className="text-sm font-medium text-yellow-200">Status:</span>
          </div>
          <div className="flex gap-2">
            {["all", "pending", "ready", "approved", "denied", "expired"].map(
              (status) => (
                <motion.button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    statusFilter === status
                      ? "text-gray-900 shadow-lg"
                      : "text-purple-100 hover:text-white"
                  }`}
                  style={statusFilter === status ? {
                    background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
                  } : {
                    background: 'rgba(244, 232, 208, 0.1)',
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </motion.button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Requests Table */}
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
                  Request ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Book
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-yellow-200">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Requested
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-yellow-200">
                  Pickup Deadline
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-yellow-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors"
                  style={{ 
                    borderColor: 'rgba(201, 169, 97, 0.2)',
                  }}
                >
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-purple-200/70">
                      #{request.id}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-yellow-100">{request.userName}</p>
                      <p className="text-xs text-purple-200/60">
                        {request.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-yellow-100">{request.bookTitle}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-purple-200/70">
                      {formatDate(request.requestedAt)}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    {request.pickupDeadline ? (
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-purple-200/60" />
                        <p className="text-sm text-purple-200/70">
                          {formatDate(request.pickupDeadline)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-purple-200/40">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {request.status === "pending" && (
                        <>
                          <motion.button
                            onClick={() => handleApprove(request.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-white rounded-lg transition-colors shadow-md"
                            style={{ background: '#10b981' }}
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeny(request.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-white rounded-lg transition-colors shadow-md"
                            style={{ background: '#ef4444' }}
                            title="Deny"
                          >
                            <XCircle size={16} />
                          </motion.button>
                        </>
                      )}
                      {request.status === "ready" && (
                        <motion.button
                          onClick={() => handleConfirmPickup(request.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-white rounded-lg transition-colors text-sm shadow-md"
                          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        >
                          Confirm Pickup
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: 'rgba(244, 232, 208, 0.2)' }}
                        title="View Details"
                      >
                        <Eye size={16} className="text-yellow-200" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-purple-200/70">
                No requests found with the selected filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
