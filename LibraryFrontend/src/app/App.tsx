import { useState } from "react";
import { Header } from "@/app/components/header";
import { HeroSection } from "@/app/components/hero-section";
import { BookCatalog } from "@/app/components/book-catalog";
import { BookDetailModal } from "@/app/components/book-detail-modal";
import { LoansPage } from "@/app/components/loans-page";
import { RecommendationsPage } from "@/app/components/recommendations-page";
import { Footer } from "@/app/components/footer";
import { AuthPage } from "@/app/components/auth-page";
import { AdminLayout } from "@/app/components/admin/admin-layout";
import { AdminDashboard } from "@/app/components/admin/admin-dashboard";
import { AdminRequests } from "@/app/components/admin/admin-requests";
import { AdminLoans } from "@/app/components/admin/admin-loans";
import { AdminUsers } from "@/app/components/admin/admin-users";
import { AdminBooks } from "@/app/components/admin/admin-books";
import { mockBooks, Book } from "@/app/data/mock-data";
import { toast, Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/app/context/auth-context";
import { motion } from "motion/react";

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<"home" | "loans" | "recommendations">("home");
  const [adminPage, setAdminPage] = useState<"dashboard" | "requests" | "loans" | "books" | "users" | "reports" | "settings">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Filter books based on search query and genre
  const filteredBooks = mockBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      book.description.toLowerCase().includes(query);

    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const handleReserve = (book: Book) => {
    if (!currentUser) {
      toast.error("Please login to reserve books");
      return;
    }

    if (book.available > 0) {
      toast.success(`Reserved "${book.title}"! Pick it up within 24 hours.`, {
        description: "You can view your reservations in My Loans.",
      });
    } else {
      toast.info(`Joined the queue for "${book.title}"`, {
        description: "We'll notify you when it becomes available.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
    toast.info("You have been logged out");
  };

  // Show auth page if not logged in
  if (!currentUser) {
    return <AuthPage onSuccess={() => {}} />;
  }

  // Show admin layout if user is admin
  if (currentUser.role === "admin") {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1A1028 0%, #2D1B4E 50%, #1E3A5F 100%)' }}>
        <Toaster position="top-right" richColors />
        <AdminLayout
          currentPage={adminPage}
          onNavigate={(page) => setAdminPage(page as any)}
          onLogout={handleLogout}
        >
          {adminPage === "dashboard" && <AdminDashboard />}
          {adminPage === "requests" && <AdminRequests />}
          {adminPage === "loans" && <AdminLoans />}
          {adminPage === "users" && <AdminUsers />}
          {adminPage === "books" && <AdminBooks />}
          {adminPage === "reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100 flex items-center gap-2">
                  Reports & Analytics
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    ✨
                  </motion.div>
                </h1>
                <p className="text-purple-200/80">Library performance and statistics</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Total Books", value: "10,458", change: "+12% this month" },
                  { title: "Active Users", value: "342", change: "+8% this month" },
                  { title: "Circulation Rate", value: "87%", change: "+5% this month" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
                    style={{
                      background: 'rgba(244, 232, 208, 0.15)',
                      border: '1px solid rgba(201, 169, 97, 0.4)',
                    }}
                  >
                    <p className="text-sm text-purple-200/70 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-yellow-200 mb-2">{stat.value}</p>
                    <p className="text-xs text-green-300">{stat.change}</p>
                  </motion.div>
                ))}
              </div>

              {/* Info */}
              <div 
                className="rounded-2xl p-8 text-center shadow-2xl backdrop-blur-lg"
                style={{
                  background: 'rgba(244, 232, 208, 0.15)',
                  border: '1px solid rgba(201, 169, 97, 0.4)',
                }}
              >
                <p className="text-purple-200/70 mb-4">Advanced analytics and detailed reports are being prepared for you.</p>
                <p className="text-yellow-200 text-sm">Stay tuned for comprehensive insights into your library's performance!</p>
              </div>
            </div>
          )}
          {adminPage === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100 flex items-center gap-2">
                  Settings
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    ⚙️
                  </motion.div>
                </h1>
                <p className="text-purple-200/80">Configure your library settings</p>
              </div>

              {/* Settings Sections */}
              <div className="space-y-4">
                {[
                  { title: "Library Information", desc: "Update library name, address, and contact details" },
                  { title: "Loan Policies", desc: "Configure loan duration, late fees, and renewal policies" },
                  { title: "Notification Settings", desc: "Manage email and SMS notifications for users" },
                  { title: "Access Control", desc: "Manage admin roles and permissions" },
                  { title: "System Preferences", desc: "Language, timezone, and display options" },
                ].map((setting, index) => (
                  <motion.div
                    key={setting.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl p-6 shadow-2xl backdrop-blur-lg flex items-center justify-between"
                    style={{
                      background: 'rgba(244, 232, 208, 0.15)',
                      border: '1px solid rgba(201, 169, 97, 0.4)',
                    }}
                  >
                    <div>
                      <h3 className="text-lg font-medium text-yellow-200 mb-1">{setting.title}</h3>
                      <p className="text-sm text-purple-200/70">{setting.desc}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-white rounded-lg transition-colors shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)',
                      }}
                    >
                      Configure
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AdminLayout>
      </div>
    );
  }

  // Show regular user interface
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1A1028 0%, #2D1B4E 50%, #1E3A5F 100%)' }}>
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <Header onNavigate={setCurrentPage} currentPage={currentPage} onLogout={handleLogout} />

      {/* Page Content */}
      {currentPage === "home" && (
        <>
          <HeroSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <BookCatalog
            books={filteredBooks}
            onViewDetails={setSelectedBook}
            onReserve={handleReserve}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </>
      )}

      {currentPage === "loans" && <LoansPage />}

      {currentPage === "recommendations" && (
        <RecommendationsPage
          onViewDetails={setSelectedBook}
          onReserve={handleReserve}
        />
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onReserve={handleReserve}
          onViewDetails={setSelectedBook}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}