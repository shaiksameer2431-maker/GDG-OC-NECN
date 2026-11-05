import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Award, Sparkles, ExternalLink } from 'lucide-react';

interface MerchandiseShowcaseProps {
  onCelebrateSwags: () => void;
}

export const MerchandiseShowcase: React.FC<MerchandiseShowcaseProps> = ({
  onCelebrateSwags,
}) => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] flex flex-col items-center">
      {/* ================= TOP HANDWRITTEN CALLOUT ================= */}
      <motion.div
        initial={{ opacity: 0, rotate: -3 }}
        animate={{ opacity: 1, rotate: -2 }}
        transition={{ duration: 0.5 }}
        className="self-start ml-2 mb-1 flex items-center gap-1.5"
      >
        <span
          className="text-xs sm:text-sm md:text-base font-black text-[#1A73E8] tracking-tight drop-shadow-xs"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          Same Labs. Bigger Opportunities! 🚀
        </span>
      </motion.div>

      {/* ================= MAIN MERCHANDISE PACK CONTAINER ================= */}
      <div className="relative w-full flex items-center justify-center">
        {/* Merchandise Image */}
        <motion.div
          animate={{
            y: [-4, 5, -4],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          onClick={onCelebrateSwags}
          className="relative z-10 cursor-pointer group/swag w-full flex items-center justify-center p-2 rounded-2xl bg-white/60 hover:bg-white/80 backdrop-blur-xs transition-all duration-300 border border-white/80 shadow-[0_10px_25px_rgba(20,43,112,0.06)]"
          title="Click to view full Swags & Rewards details"
        >
          <img
            src="/banner-assets/swags-showcase.png"
            alt="Google Cloud Swags Pack: T-shirt, Water bottle, Bag, Badges"
            className="w-full h-auto object-contain max-h-[160px] sm:max-h-[190px] md:max-h-[220px] transition-transform duration-500 group-hover/swag:scale-[1.03]"
            loading="eager"
          />

          {/* Hover Pill Hint */}
          <div className="absolute top-2 right-2 opacity-0 group-hover/swag:opacity-100 transition-opacity bg-[#1A73E8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Gift className="w-3 h-3" />
            <span>View Rewards</span>
          </div>
        </motion.div>

        {/* ================= FLOATING BADGE & SWAG CARDS ================= */}
        {/* 1. Yellow 5 Badges Card */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 right-0 z-20 px-2.5 py-1.5 rounded-xl bg-gradient-to-br from-[#FEF7E0] to-[#FDE293] border border-[#F9AB00]/50 shadow-[0_4px_12px_rgba(249,171,0,0.2)] flex flex-col items-center select-none"
        >
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-[#B06000]" />
            <span className="text-xs sm:text-sm font-black text-[#202124] leading-none">5</span>
          </div>
          <span className="text-[9px] font-extrabold text-[#754A00] uppercase tracking-wider">
            Badges
          </span>
        </motion.div>

        {/* 2. Green 10 Badges Card */}
        <motion.div
          animate={{ y: [3, -3, 3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-3 sm:-right-4 z-20 px-2.5 py-1.5 rounded-xl bg-gradient-to-br from-[#E6F4EA] to-[#CEEAD6] border border-[#34A853]/50 shadow-[0_4px_12px_rgba(52,168,83,0.2)] flex flex-col items-center select-none"
        >
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#137333]" />
            <span className="text-xs sm:text-sm font-black text-[#202124] leading-none">10</span>
          </div>
          <span className="text-[9px] font-extrabold text-[#137333] uppercase tracking-wider">
            Badges
          </span>
        </motion.div>
      </div>

      {/* ================= 3. BLUE SWAGS PROMO BUTTON ================= */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCelebrateSwags}
        className="mt-2.5 z-20 w-full sm:w-auto px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-[#1A73E8] to-[#174EA6] hover:from-[#174EA6] hover:to-[#185ABC] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_14px_rgba(26,115,232,0.35)] flex items-center justify-center gap-2 transition-all"
      >
        <Gift className="w-4 h-4 text-[#FBBC04]" />
        <span>Win Exciting Swags! 🏆</span>
      </motion.button>
    </div>
  );
};
