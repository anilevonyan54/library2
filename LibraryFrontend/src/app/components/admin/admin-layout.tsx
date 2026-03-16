import { ReactNode } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Search,
  BookMarked,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "requests", label: "Requests", icon: FileText },
  { id: "loans", label: "Loans", icon: BookMarked },
  { id: "books", label: "Books & Inventory", icon: BookOpen },
  { id: "users", label: "Users", icon: Users },
  { id: "reports", label: "Reports / Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: AdminLayoutProps) {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside 
        className="w-64 flex flex-col shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #2D1B4E 0%, #1E3A5F 100%)',
        }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(201, 169, 97, 0.3)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)',
                boxShadow: '0 0 15px rgba(201, 169, 97, 0.4)',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(201, 169, 97, 0.3), transparent)',
                }}
              />
              <span className="relative z-10">📚</span>
            </div>
            <div>
              <h2 className="font-semibold text-yellow-200 flex items-center gap-2">
                Admin Desk
                <Sparkles size={14} className="text-yellow-300" />
              </h2>
              <p className="text-xs text-purple-200/70">Librarian Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "text-gray-900 shadow-lg"
                    : "text-purple-100 hover:text-white"
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
                } : {
                  background: 'rgba(244, 232, 208, 0.05)',
                }}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(201, 169, 97, 0.3)' }}>
          <div className="mb-3 px-2">
            <p className="text-xs text-purple-200/70 mb-1">Logged in as</p>
            <p className="text-sm truncate text-yellow-200">{currentUser?.name}</p>
            <p className="text-xs text-purple-200/60 truncate">
              {currentUser?.email}
            </p>
          </div>
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-purple-100"
            style={{ background: 'rgba(244, 232, 208, 0.1)' }}
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header 
          className="border-b px-8 py-4 shadow-lg backdrop-blur-md"
          style={{
            background: 'rgba(45, 27, 78, 0.8)',
            borderColor: 'rgba(201, 169, 97, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="relative w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users or books..."
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:border-yellow-600 transition-colors backdrop-blur-sm"
                style={{
                  background: 'rgba(244, 232, 208, 0.95)',
                  borderColor: 'rgba(201, 169, 97, 0.5)',
                  color: '#2C2C2C',
                }}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg text-sm transition-colors text-purple-100"
                style={{ background: 'rgba(244, 232, 208, 0.15)' }}
              >
                Today
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg text-sm transition-colors text-purple-100"
                style={{ background: 'rgba(244, 232, 208, 0.15)' }}
              >
                Overdue
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg text-sm transition-colors text-purple-100"
                style={{ background: 'rgba(244, 232, 208, 0.15)' }}
              >
                Pending
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
