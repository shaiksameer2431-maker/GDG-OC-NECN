import React from 'react';
import { motion } from 'framer-motion';
import { Check, Send } from 'lucide-react';

export const LearningPathCard: React.FC = () => {
  const steps = [
    'Complete Labs',
    'Earn Badges',
    'Win Swags',
    'Build Your Future',
    'Be Future Ready!',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] rounded-2xl bg-[#FCFDFD] p-3 sm:p-4 shadow-[0_8px_24px_rgba(20,43,112,0.08)] border border-slate-200/90"
    >
      {/* Spiral Binding Holes at Top */}
      <div className="absolute -top-2 inset-x-0 flex justify-around px-4 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="w-2.5 h-3.5 rounded-full bg-slate-300 border border-slate-400/60 shadow-inner"
          />
        ))}
      </div>

      {/* Notebook Title */}
      <div className="flex items-center justify-between mt-1 mb-2.5 pb-1 border-b border-dashed border-slate-200">
        <h4 className="font-black text-xs sm:text-sm text-[#142B70] tracking-tight uppercase">
          Your Learning Path
        </h4>
        <span className="text-[10px] font-bold text-[#34A853] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
          5 Steps
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-1.5 text-left">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
            className="flex items-center gap-2 group/step"
          >
            <div className="w-4 h-4 rounded-[5px] bg-[#34A853] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight group-hover/step:text-[#1A73E8] transition-colors">
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Flying Paper Airplane on Dashed Curve */}
      <div className="absolute -bottom-3 -right-3 pointer-events-none flex items-center justify-center">
        {/* Dashed trajectory trail SVG */}
        <svg className="w-16 h-12 overflow-visible" viewBox="0 0 60 40" fill="none">
          <path
            d="M 5 35 Q 25 30 50 10"
            stroke="#1A73E8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
        </svg>

        {/* Paper Airplane Icon */}
        <motion.div
          animate={{
            x: [0, 4, 0],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1 right-0 text-[#1A73E8] transform rotate-12 drop-shadow-sm"
        >
          <Send className="w-4 h-4 fill-[#1A73E8]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

