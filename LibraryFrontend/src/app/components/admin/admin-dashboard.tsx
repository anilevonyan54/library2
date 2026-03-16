import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { apiFetch } from "@/app/api/client";
import { useAuth } from "@/app/context/auth-context";

export function AdminDashboard() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [pendingReservationsCount, setPendingReservationsCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const d = await apiFetch<any>("/api/admin/dashboard", { token: token || undefined });
        setDashboard(d);
      } catch {
        setDashboard(null);
      }
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const pending = await apiFetch<any[]>("/api/admin/reservations/pending", { token: token || undefined });
        setPendingReservationsCount(pending.length);
      } catch {
        setPendingReservationsCount(0);
      }
    })();
  }, [token]);

  const statCards = useMemo(() => {
    const activeLoans = dashboard?.activeLoans ?? 0;
    const lateReturns = dashboard?.lateReturns ?? 0;
    const lostBooks = dashboard?.lostBooks ?? 0;

    return [
      {
        label: "Pending Requests",
        value: pendingReservationsCount,
        icon: Clock,
        color: "bg-amber-500",
      },
      {
        label: "Active Loans",
        value: activeLoans,
        icon: BookOpen,
        color: "bg-blue-600",
      },
      {
        label: "Late Returns",
        value: lateReturns,
        icon: AlertCircle,
        color: "bg-burgundy",
      },
      {
        label: "Lost Books",
        value: lostBooks,
        icon: CheckCircle,
        color: "bg-gray-600",
      },
    ];
  }, [dashboard, pendingReservationsCount]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">Dashboard</h1>
        <p className="text-purple-200/80">
          Library overview (real data)
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
            <TrendingUp className="text-yellow-300" size={20} />
            <h2 className="text-xl text-yellow-200">Notes</h2>
          </div>
          <p className="text-sm text-purple-200/70">
            Use the left menu for real actions:
            <br />- Reservation approvals are in <strong>Requests</strong>
            <br />- Loan operations are in <strong>Loans</strong>
          </p>
        </motion.div>
      </div>

    </div>
  );
}