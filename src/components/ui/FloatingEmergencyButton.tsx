import React, { useState } from "react";
import { Siren, MessageCircle, MapPin, X } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/628112609091";
const MAPS_URL = "https://www.google.com/maps/search/Klinik+Hewan+D'FREEZE+Ngemplak+Sleman";

export default function FloatingEmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { 
      y: 20, 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-999 flex flex-col items-center gap-4">

      {/* Expanded Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-4 mb-2"
          >
            {/* WhatsApp Button */}
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-green-500/30"
              title="Hubungi WhatsApp"
            >
              <MessageCircle size={28} />
            </motion.a>

            {/* Maps Button */}
            <motion.a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-[#00AEEF] flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
              title="Buka Maps"
            >
              <MapPin size={28} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-colors duration-300 ${
          isOpen ? "bg-white text-primary border-2 border-primary" : "bg-[#FF3B30]"
        }`}
      >
        {/* Pulsing Aura (only when closed) */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[#FF3B30] -z-10"
          />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={32} className="text-primary"/>
            </motion.div>
          ) : (
            <motion.div
              key="emergency"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Siren size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
