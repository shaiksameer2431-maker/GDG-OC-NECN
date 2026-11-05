import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Award, TrendingUp } from 'lucide-react';

export const BenefitsPanel: React.FC = () => {
  const items = [
    {
      icon: Cloud,
      title: 'Learn',
      description: 'in-demand cloud skills',
      iconBg: 'bg-[#E8F0FE]',
      iconColor: 'text-[#1A73E8]',
      borderColor: 'border-[#4285F4]/30',
    },
    {
      icon: Award,
      title: 'Earn',
      description: 'official Google badges',
      iconBg: 'bg-[#FEF7E0]',
      iconColor: 'text-[#F9AB00]',
      borderColor: 'border-[#FBBC04]/30',
    },
    {
      icon: TrendingUp,
      title: 'Build',
      description: 'your profile for future opportunities',
      iconBg: 'bg-[#E6F4EA]',
      iconColor: 'text-[#1E8E3E]',
      borderColor: 'border-[#34A853]/30',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10 w-full max-w-[420px] rounded-2xl bg-white/85 backdrop-blur-md p-3 sm:p-4 shadow-[0_8px_30px_rgba(20,43,112,0.06)] border border-white/95"
    >
      <div className="grid grid-cols-3 divide-x divide-slate-200/80">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex flex-col items-center text-center px-1.5 sm:px-2.5 transition-transform duration-300 hover:scale-[1.03]`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-1.5 shadow-xs`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#142B70] tracking-tight">
                {item.title}
              </h4>
              <p className="text-[9px] sm:text-[10px] leading-tight text-slate-600 font-medium mt-0.5">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
