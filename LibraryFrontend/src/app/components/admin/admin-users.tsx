import { useEffect, useMemo, useState } from "react";
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
import { toast } from "sonner";
import { apiFetch } from "@/app/api/client";
import { useAuth } from "@/app/context/auth-context";

export function AdminUsers() {
  const { token } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<any[]>("/api/admin/users", { token: token || undefined });
        setUsers(res);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load users");
        setUsers([]);
      }
    })();
  }, [token]);

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

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      String(u.name || "").toLowerCase().includes(q) ||
      String(u.email || "").toLowerCase().includes(q)
    );
  }, [users, query]);

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
        {filteredUsers.map((user, index) => {
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
                    <p className="text-xs text-purple-200/60">
                      Role: {user.role}{user.adminLevel === 2 ? " (super admin)" : user.adminLevel === 1 ? " (admin)" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-yellow-100 bg-white/10"
              >
                <Award size={14} />
                {user.adminRequestStatus === "pending"
                  ? "Admin request pending"
                  : user.adminRequestStatus === "denied"
                  ? "Admin request denied"
                  : "Active"}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-purple-200/60">User ID</p>
                  <p className="font-medium text-yellow-100">{user.id}</p>
                </div>
                <div>
                  <p className="text-purple-200/60">Created</p>
                  <p className="font-medium text-yellow-100">
                    {user.createdAt ? String(user.createdAt).slice(0, 10) : "-"}
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
              <div className="rounded-lg p-4" style={{ background: "rgba(139, 107, 71, 0.15)" }}>
                <p className="text-sm text-gray-700 mb-1">Role</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.role}</p>
                <p className="text-sm text-gray-700 mt-3 mb-1">Admin request status</p>
                <p className="text-gray-900">{selectedUser.adminRequestStatus}</p>
              </div>

              <div className="rounded-lg p-4" style={{ background: "rgba(139, 107, 71, 0.15)" }}>
                <p className="text-sm text-gray-700 mb-1">Note</p>
                <p className="text-sm text-gray-800">
                  This page now shows real users from PostgreSQL. (Admin notes UI is not wired yet.)
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}