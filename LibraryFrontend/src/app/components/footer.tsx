import { BookOpen, Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
  return (
    <footer 
      className="mt-20 border-t backdrop-blur-md"
      style={{
        background: 'rgba(45, 27, 78, 0.5)',
        borderColor: 'rgba(201, 169, 97, 0.3)',
      }}
    >
      {/* Magical glow effect */}
      <div className="h-1" style={{ 
        background: 'linear-gradient(90deg, transparent, rgba(201, 169, 97, 0.5), transparent)',
        boxShadow: '0 -2px 10px rgba(201, 169, 97, 0.3)',
      }}></div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Branding */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C9A961 0%, #8B6B47 100%)',
                boxShadow: '0 0 15px rgba(201, 169, 97, 0.4)',
              }}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-yellow-200">Smart Library</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>

          {/* Center: Quote */}
          <p className="text-sm text-purple-200/70 italic text-center">
            "A library is not a luxury but one of the necessities of life."
          </p>

          {/* Right: Made with love */}
          <div className="flex items-center gap-2 text-sm text-purple-200/70">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>for book lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
