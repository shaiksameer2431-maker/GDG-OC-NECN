import React from 'react';

interface RankMedalProps {
  rank: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RankMedal: React.FC<RankMedalProps> = ({ rank, size = 'md', className = '' }) => {
  const isGold = rank === 1;
  const isSilver = rank === 2;

  const config = isGold
    ? {
        ribbonLeft: '#1A73E8', // Google Blue
        ribbonRight: '#EA4335', // Google Red
        rimOuter: '#F59E0B',
        rimInner: '#FCD34D',
        coinBg: '#FEF3C7',
        textColor: '#78350F',
        border: '#D97706',
        title: 'Gold Medal - 1st Place'
      }
    : isSilver
      ? {
        ribbonLeft: '#475569',
        ribbonRight: '#94A3B8',
        rimOuter: '#94A3B8',
        rimInner: '#CBD5E1',
        coinBg: '#F1F5F9',
        textColor: '#1E293B',
        border: '#64748B',
        title: 'Silver Medal - 2nd Place'
      }
      : {
        ribbonLeft: '#92400E',
        ribbonRight: '#B45309',
        rimOuter: '#B45309',
        rimInner: '#FDBA74',
        coinBg: '#FFEDD5',
        textColor: '#7C2D12',
        border: '#9A3412',
        title: 'Bronze Medal - 3rd Place'
      };

  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <div className={`inline-flex items-center justify-center ${dim} select-none shrink-0 ${className}`} title={config.title}>
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ribbon V-Fold */}
        <path d="M11 2 L14 13 L8 13 Z" fill={config.ribbonLeft} />
        <path d="M21 2 L18 13 L24 13 Z" fill={config.ribbonRight} />
        
        {/* Outer Coin */}
        <circle cx="16" cy="19" r="11" fill={config.rimOuter} stroke={config.border} strokeWidth="1" />
        
        {/* Inner Coin Bevel */}
        <circle cx="16" cy="19" r="8.5" fill={config.coinBg} stroke={config.rimInner} strokeWidth="1.2" />
        
        {/* Rank Number in Medal Itself */}
        <text
          x="16"
          y="22.5"
          textAnchor="middle"
          fontSize="10"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill={config.textColor}
        >
          {rank}
        </text>
      </svg>
    </div>
  );
};

