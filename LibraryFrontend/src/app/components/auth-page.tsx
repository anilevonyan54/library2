import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Sparkles, 
  Star, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  BookMarked,
  Users,
  Shield,
  Award,
  X
} from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { toast } from "sonner";

interface AuthPageProps {
  onSuccess: () => void;
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        toast.success("Welcome back to Smart Library!");
        onSuccess();
      } else {
        toast.error("Invalid email or password");
      }
    } else {
      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }
      const success = register(name, email, password);
      if (success) {
        toast.success("Welcome to Smart Library!");
        onSuccess();
      } else {
        toast.error("User already exists with this email");
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password reset link sent to your email!");
    setShowForgotPassword(false);
  };

  const openAuthModal = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Starry Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #1A1028 0%, #2D1B4E 50%, #1E3A5F 100%)',
        }}
      >
        {/* Animated stars */}
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Floating sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Sparkles className="text-yellow-300/40" size={16} />
          </motion.div>
        ))}
      </div>

      {/* Fixed Auth Buttons - Top Right Corner */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openAuthModal(true)}
          className="px-6 py-3 rounded-full text-white shadow-lg backdrop-blur-md border border-yellow-600/50 hover:border-yellow-500"
          style={{
            background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.9) 0%, rgba(30, 58, 95, 0.9) 100%)',
          }}
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openAuthModal(false)}
          className="px-6 py-3 rounded-full text-gray-900 shadow-lg backdrop-blur-md border border-yellow-600"
          style={{
            background: 'linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)',
          }}
        >
          Register
        </motion.button>
      </div>

      {/* Main Content - Always Visible */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Logo and Title */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 relative"
              style={{
                background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)',
                boxShadow: '0 0 40px rgba(201, 169, 97, 0.5)',
              }}
            >
              <BookOpen className="text-white" size={48} />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(201, 169, 97, 0.4), transparent)',
                }}
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200"
            >
              Smart Library
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-purple-200/90 italic mb-3"
            >
              Where Magic Meets Knowledge
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-purple-300/70 max-w-2xl mx-auto"
            >
              Step into a realm where ancient wisdom meets modern magic. Discover thousands of mystical tomes 
              and contemporary treasures in our enchanted library.
            </motion.p>
          </div>

          {/* Grid Layout for Information Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* About Us Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-6 rounded-2xl backdrop-blur-lg shadow-2xl"
              style={{
                background: 'rgba(244, 232, 208, 0.15)',
                border: '1px solid rgba(201, 169, 97, 0.4)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)' }}>
                  <Star className="text-white" size={24} />
                </div>
                <h3 className="text-xl text-yellow-200">About Us</h3>
              </div>
              <p className="text-purple-100/90 leading-relaxed text-sm">
                Our library has been a sanctuary for knowledge seekers since 1342, housing mystical tomes 
                and modern treasures. We blend ancient wisdom with contemporary literature in an enchanted space.
              </p>
            </motion.div>

            {/* Member Benefits Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-6 rounded-2xl backdrop-blur-lg shadow-2xl"
              style={{
                background: 'rgba(244, 232, 208, 0.15)',
                border: '1px solid rgba(201, 169, 97, 0.4)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)' }}>
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="text-xl text-yellow-200">Benefits</h3>
              </div>
              <div className="space-y-2">
                {[
                  { icon: BookMarked, text: "10,000+ Books" },
                  { icon: Users, text: "Reader Community" },
                  { icon: Sparkles, text: "AI Recommendations" },
                  { icon: Shield, text: "Priority Access" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-purple-100/90 text-sm">
                    <CheckCircle className="text-yellow-300 flex-shrink-0" size={16} />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="p-6 rounded-2xl backdrop-blur-lg shadow-2xl"
              style={{
                background: 'rgba(244, 232, 208, 0.15)',
                border: '1px solid rgba(201, 169, 97, 0.4)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)' }}>
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-xl text-yellow-200">Contact Us</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-purple-100/90">
                  <MapPin className="text-yellow-300 flex-shrink-0 mt-0.5" size={16} />
                  <span>123 Enchanted Avenue, Mystical Quarter</span>
                </div>
                <div className="flex items-start gap-2 text-purple-100/90">
                  <Clock className="text-yellow-300 flex-shrink-0 mt-0.5" size={16} />
                  <span>Mon-Fri: 8am-10pm<br/>Weekends: 9am-8pm</span>
                </div>
                <div className="flex items-start gap-2 text-purple-100/90">
                  <Phone className="text-yellow-300 flex-shrink-0 mt-0.5" size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Fun Fact */}
            <div className="p-6 rounded-xl backdrop-blur-md"
              style={{
                background: 'rgba(139, 107, 71, 0.2)',
                border: '1px solid rgba(201, 169, 97, 0.3)',
              }}>
              <p className="text-sm text-purple-200/90 italic flex items-start gap-3">
                <Sparkles className="text-yellow-300 flex-shrink-0 mt-1" size={20} />
                <span>
                  <strong className="text-yellow-200">Did you know?</strong> Our oldest book dates back to 1342 
                  and is said to whisper forgotten spells to those who listen carefully at midnight.
                </span>
              </p>
            </div>

            {/* Bookshelf Details */}
            <div className="p-6 rounded-xl backdrop-blur-md"
              style={{
                background: 'rgba(139, 107, 71, 0.2)',
                border: '1px solid rgba(201, 169, 97, 0.3)',
              }}>
              <p className="text-sm text-purple-200/90 flex items-start gap-3">
                <BookOpen className="text-yellow-300 flex-shrink-0 mt-1" size={20} />
                <span>
                  <strong className="text-yellow-200">Our Collection:</strong> Over 50 enchanted bookshelves 
                  spanning fiction, non-fiction, fantasy, mystery, romance, and rare magical manuscripts.
                </span>
              </p>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-12 text-center"
          >
            <p className="text-purple-200/70 italic text-lg">
              "A library is not a luxury but one of the necessities of life."
            </p>
            <p className="text-purple-300/50 text-sm mt-1">— Henry Ward Beecher</p>
          </motion.div>
        </div>
      </div>

      {/* Expandable Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 200, y: -200 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 200, y: -200 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md"
            >
              <div
                className="rounded-2xl p-8 backdrop-blur-lg shadow-2xl relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 232, 208, 0.98) 0%, rgba(230, 213, 184, 0.98) 100%)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(201, 169, 97, 0.3)',
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>

                {showForgotPassword ? (
                  // Forgot Password Form
                  <>
                    <h2 className="text-2xl mb-4 text-gray-800">Reset Password</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Enter your email and we'll send you a magical link to reset your password.
                    </p>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-800">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={20}
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors bg-white/80"
                            placeholder="wizard@hogwarts.edu"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full text-white py-3.5 rounded-lg transition-all shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)',
                        }}
                      >
                        Send Reset Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full text-gray-700 py-2.5 rounded-lg transition-colors hover:bg-gray-200"
                      >
                        Back to Login
                      </button>
                    </form>
                  </>
                ) : (
                  // Login/Register Form
                  <>
                    {/* Tab Switcher */}
                    <div className="flex gap-2 mb-6 p-1 rounded-lg" style={{ background: 'rgba(139, 107, 71, 0.2)' }}>
                      <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 rounded-lg transition-all duration-300 ${
                          isLogin
                            ? "text-white shadow-lg"
                            : "text-gray-700 hover:bg-white/30"
                        }`}
                        style={isLogin ? {
                          background: 'linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)',
                        } : {}}
                      >
                        Login
                      </button>
                      <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 rounded-lg transition-all duration-300 ${
                          !isLogin
                            ? "text-white shadow-lg"
                            : "text-gray-700 hover:bg-white/30"
                        }`}
                        style={!isLogin ? {
                          background: 'linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)',
                        } : {}}
                      >
                        Register
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <AnimatePresence mode="wait">
                        {!isLogin && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <label className="block text-sm mb-2 text-gray-800">
                              Full Name
                            </label>
                            <div className="relative">
                              <UserIcon
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                size={20}
                              />
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm"
                                placeholder="Hermione Granger"
                                required={!isLogin}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="block text-sm mb-2 text-gray-800">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={20}
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm"
                            placeholder="wizard@hogwarts.edu"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm text-gray-800">
                            Password
                          </label>
                          {isLogin && (
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword(true)}
                              className="text-xs text-purple-700 hover:text-purple-900 underline"
                            >
                              Forgot Password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={20}
                          />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm"
                            placeholder="••••••••"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-white py-3.5 rounded-lg transition-all shadow-lg relative overflow-hidden group"
                        style={{
                          background: 'linear-gradient(135deg, #2D1B4E 0%, #1E3A5F 100%)',
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isLogin ? "Enter the Library" : "Join the Magic"}
                          <Sparkles size={18} />
                        </span>
                      </motion.button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 rounded-lg border-2 border-yellow-700/30" style={{ background: 'rgba(201, 169, 97, 0.15)' }}>
                      <p className="text-xs text-gray-700 mb-2">
                        <strong>🔑 Demo Credentials:</strong>
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        User: alice.johnson@example.com / password123
                      </p>
                      <p className="text-xs text-gray-600">
                        Admin: charlie.brown@example.com / admin789
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
