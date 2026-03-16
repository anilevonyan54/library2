import { BookOpen, Search, Heart, User, ChevronDown, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { motion } from "motion/react";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout?: () => void;
}

export function Header({ onNavigate, currentPage, onLogout }: HeaderProps) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const { currentUser } = useAuth();

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    setLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Header Bar */}
      <div 
        className="border-b shadow-lg backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.95) 0%, rgba(30, 58, 95, 0.95) 100%)',
          borderColor: 'rgba(201, 169, 97, 0.3)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <motion.button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)',
                  boxShadow: '0 0 20px rgba(201, 169, 97, 0.4)',
                }}
              >
                <BookOpen className="w-5 h-5 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(201, 169, 97, 0.3), transparent)',
                  }}
                />
              </div>
              <h1 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100 group-hover:from-yellow-100 group-hover:to-yellow-300 transition-all">
                Smart Library
              </h1>
            </motion.button>

            {/* Middle: Navigation */}
            <nav className="flex items-center gap-2">
              <motion.button
                onClick={() => onNavigate("home")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  currentPage === "home"
                    ? "text-gray-900 shadow-lg"
                    : "text-purple-100 hover:text-white"
                }`}
                style={currentPage === "home" ? {
                  background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
                } : {
                  background: 'rgba(244, 232, 208, 0.1)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => onNavigate("recommendations")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  currentPage === "recommendations"
                    ? "text-gray-900 shadow-lg"
                    : "text-purple-100 hover:text-white"
                }`}
                style={currentPage === "recommendations" ? {
                  background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
                } : {
                  background: 'rgba(244, 232, 208, 0.1)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommendations</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => onNavigate("loans")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  currentPage === "loans"
                    ? "text-gray-900 shadow-lg"
                    : "text-purple-100 hover:text-white"
                }`}
                style={currentPage === "loans" ? {
                  background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
                } : {
                  background: 'rgba(244, 232, 208, 0.1)',
                }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>My Loans</span>
                </div>
              </motion.button>
            </nav>

            {/* Right: User & Language */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-all text-sm backdrop-blur-sm text-purple-100 hover:text-white"
                  style={{ background: 'rgba(244, 232, 208, 0.1)' }}
                >
                  <span>{currentLang}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {languageOpen && (
                  <div 
                    className="absolute right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden min-w-[80px] backdrop-blur-lg"
                    style={{
                      background: 'rgba(244, 232, 208, 0.98)',
                      borderColor: 'rgba(201, 169, 97, 0.5)',
                    }}
                  >
                    <button
                      onClick={() => handleLanguageChange("EN")}
                      className="w-full px-4 py-2 text-sm text-left text-gray-800 hover:bg-yellow-600/20 transition-colors"
                    >
                      EN
                    </button>
                    <button
                      onClick={() => handleLanguageChange("RU")}
                      className="w-full px-4 py-2 text-sm text-left text-gray-800 hover:bg-yellow-600/20 transition-colors"
                    >
                      RU
                    </button>
                    <button
                      onClick={() => handleLanguageChange("HY")}
                      className="w-full px-4 py-2 text-sm text-left text-gray-800 hover:bg-yellow-600/20 transition-colors"
                    >
                      HY
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)',
                    boxShadow: '0 0 20px rgba(201, 169, 97, 0.4)',
                  }}
                >
                  <User className="w-5 h-5 text-white" />
                </motion.button>
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden min-w-[200px] backdrop-blur-lg"
                    style={{
                      background: 'rgba(244, 232, 208, 0.98)',
                      borderColor: 'rgba(201, 169, 97, 0.5)',
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(139, 107, 71, 0.3)' }}>
                      <p className="text-sm font-medium text-gray-800">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {currentUser?.email}
                      </p>
                    </div>
                    {onLogout && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-gray-800 hover:bg-yellow-600/20 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Magical glow effect */}
      <div className="h-1" style={{ 
        background: 'linear-gradient(90deg, transparent, rgba(201, 169, 97, 0.5), transparent)',
        boxShadow: '0 2px 10px rgba(201, 169, 97, 0.3)',
      }}></div>
    </header>
  );
}
