import React from 'react';
import { inferStudentGender } from '../../utils/genderDetector';

interface AvatarProps {
  name: string;
  rank?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Deterministic hash code from string
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export const Avatar: React.FC<AvatarProps> = ({ name, rank, size = 'md', className = '' }) => {
  const cleanName = (name || 'NECN Student').trim();
  const hash = hashString(cleanName);

  // Accurate gender inference based on student name
  const gender = inferStudentGender(cleanName);
  const isFemale = gender === 'female';

  // Apple-inspired soft pastel background gradients
  const femaleBackgrounds = [
    { bg: '#FCE7F3', fg: '#DB2777' }, // Pink
    { bg: '#EDE9FE', fg: '#7C3AED' }, // Lavender
    { bg: '#FFE4E6', fg: '#E11D48' }, // Rose
    { bg: '#E0F2FE', fg: '#0284C7' }, // Sky
    { bg: '#FEF3C7', fg: '#D97706' }, // Warm Amber
    { bg: '#CCFBF1', fg: '#0D9488' }, // Mint Teal
  ];

  const maleBackgrounds = [
    { bg: '#E0F2FE', fg: '#0284C7' }, // Sky Blue
    { bg: '#F1F5F9', fg: '#475569' }, // Slate
    { bg: '#DCFCE7', fg: '#16A34A' }, // Mint
    { bg: '#E0E7FF', fg: '#4F46E5' }, // Indigo
    { bg: '#FEF3C7', fg: '#D97706' }, // Amber
    { bg: '#FFEDD5', fg: '#EA580C' }, // Peach
  ];

  const bgList = isFemale ? femaleBackgrounds : maleBackgrounds;
  const bg = bgList[hash % bgList.length];

  // Natural skin tones
  const skinTones = ['#FFDFC4', '#F0C7A1', '#E0A97E', '#C68642', '#F5D6B8', '#D89562'];
  const skin = skinTones[(hash >> 2) % skinTones.length];

  // Natural dark hair colors
  const hairColors = ['#18181B', '#27272A', '#3F2012', '#451A03', '#1C1917'];
  const hairColor = hairColors[(hash >> 4) % hairColors.length];

  // Clothing color palette
  const femaleShirts = ['#E11D48', '#8B5CF6', '#2563EB', '#059669', '#D97706', '#DB2777'];
  const maleShirts = ['#2563EB', '#1E293B', '#059669', '#D97706', '#4F46E5', '#DC2626'];
  const shirtColor = isFemale
    ? femaleShirts[(hash >> 6) % femaleShirts.length]
    : maleShirts[(hash >> 6) % maleShirts.length];

  // Gender-specific hair style variant (4 distinct designs each)
  const hairStyle = (hash >> 3) % 4;

  // Eyewear (0=none, 1=round glasses, 2=square glasses, 3=none)
  const eyewear = (hash >> 5) % 4;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  // Rank rings for top 3 champions
  const rankRing = rank === 1
    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white shadow-md'
    : rank === 2
      ? 'ring-2 ring-slate-400 ring-offset-2 ring-offset-white shadow-sm'
      : rank === 3
        ? 'ring-2 ring-amber-600 ring-offset-2 ring-offset-white shadow-sm'
        : 'border border-slate-200/90 shadow-2xs';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${sizeClasses[size]} ${rankRing} ${className} select-none transition-transform duration-300 hover:scale-105`}
      title={`${cleanName} (${isFemale ? 'Female' : 'Male'})`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <rect width="100" height="100" fill={bg.bg} />

        {/* Ambient radial glow */}
        <circle cx="50" cy="50" r="45" fill={bg.fg} opacity="0.09" />

        {/* ================= BACK HAIR (FOR FEMALE LONG HAIRSTYLES) ================= */}
        {isFemale && (
          <>
            {hairStyle === 0 && (
              // Long cascading hair behind shoulders
              <g fill={hairColor}>
                <path d="M 23 38 C 17 56, 17 76, 25 92 C 30 92, 33 76, 30 52 Z" />
                <path d="M 77 38 C 83 56, 83 76, 75 92 C 70 92, 67 76, 70 52 Z" />
              </g>
            )}
            {hairStyle === 2 && (
              // Side cascade over shoulder
              <g fill={hairColor}>
                <path d="M 23 38 C 18 52, 20 72, 28 85 C 32 82, 30 65, 29 48 Z" />
              </g>
            )}
            {hairStyle === 3 && (
              // Shoulder-length wavy lob
              <g fill={hairColor}>
                <path d="M 24 40 C 20 54, 22 70, 29 76 C 32 72, 30 58, 29 44 Z" />
                <path d="M 76 40 C 80 54, 78 70, 71 76 C 68 72, 70 58, 71 44 Z" />
              </g>
            )}
          </>
        )}

        {/* Shoulders & Clothing */}
        <path
          d="M 18 100 C 18 78, 32 70, 50 70 C 68 70, 82 78, 82 100 Z"
          fill={shirtColor}
        />

        {/* Shirt collar notch / scoop neck */}
        {isFemale ? (
          <path d="M 42 70 Q 50 78 58 70 Z" fill={skin} opacity="0.95" />
        ) : (
          <polygon points="50,78 44,70 56,70" fill={skin} opacity="0.9" />
        )}

        {/* Neck */}
        <rect x="44" y="58" width="12" height="15" rx="3" fill={skin} />

        {/* Ears */}
        <circle cx="30" cy="48" r="4.5" fill={skin} />
        <circle cx="70" cy="48" r="4.5" fill={skin} />

        {/* Female Ear Studs (Gold/Pearl) */}
        {isFemale && (
          <>
            <circle cx="30" cy="50" r="1.8" fill="#FBBF24" />
            <circle cx="70" cy="50" r="1.8" fill="#FBBF24" />
          </>
        )}

        {/* Head / Face */}
        <ellipse cx="50" cy="46" rx="19.5" ry="22.5" fill={skin} />

        {/* ================= FRONT HAIRSTYLES ================= */}
        {isFemale ? (
          // FEMALE HAIRSTYLES
          <>
            {hairStyle === 0 && (
              // Elegant center-part with curved front locks
              <g fill={hairColor}>
                <path d="M 26 42 C 24 22, 40 18, 50 18 C 60 18, 76 22, 74 42 C 70 33, 62 28, 50 28 C 38 28, 30 33, 26 42 Z" />
                <path d="M 28 42 C 27 50, 31 58, 34 62 C 34 55, 31 48, 30 42 Z" />
                <path d="M 72 42 C 73 50, 69 58, 66 62 C 66 55, 69 48, 70 42 Z" />
              </g>
            )}

            {hairStyle === 1 && (
              // High top-knot / chic bun with floral hairpin accent
              <g fill={hairColor}>
                <circle cx="50" cy="15" r="10" />
                <path d="M 28 42 C 26 24, 40 20, 50 20 C 60 20, 74 24, 72 42 C 68 33, 60 30, 50 30 C 40 30, 32 33, 28 42 Z" />
                {/* Cute flower pin */}
                <circle cx="58" cy="18" r="3.5" fill="#F43F5E" />
                <circle cx="58" cy="18" r="1.5" fill="#FEF08A" />
              </g>
            )}

            {hairStyle === 2 && (
              // Side-part wave with soft front bang
              <g fill={hairColor}>
                <path d="M 25 40 C 23 22, 42 19, 50 19 C 58 19, 75 22, 73 40 C 69 32, 60 29, 50 29 C 40 29, 31 32, 25 40 Z" />
                <path d="M 33 28 C 42 33, 54 31, 58 28 C 48 26, 38 26, 33 28 Z" opacity="0.6" />
              </g>
            )}

            {hairStyle === 3 && (
              // Chic bob cut with side bangs
              <g fill={hairColor}>
                <path d="M 26 44 C 24 23, 40 19, 50 19 C 60 19, 76 23, 74 44 C 71 34, 61 30, 50 30 C 39 30, 29 34, 26 44 Z" />
                <rect x="25" y="38" width="6" height="18" rx="3" />
                <rect x="69" y="38" width="6" height="18" rx="3" />
              </g>
            )}

            {/* Female Eyebrows (Arched, delicate) */}
            <path d="M 39 40 Q 44 38 48 40" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 52 40 Q 56 38 61 40" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Eyes with gentle eyelashes */}
            <circle cx="43.5" cy="46" r="2.3" fill="#0F172A" />
            <circle cx="44.2" cy="45.2" r="0.8" fill="#FFFFFF" />
            <path d="M 40.5 44 L 39 42.5" stroke={hairColor} strokeWidth="1" strokeLinecap="round" />

            <circle cx="56.5" cy="46" r="2.3" fill="#0F172A" />
            <circle cx="57.2" cy="45.2" r="0.8" fill="#FFFFFF" />
            <path d="M 59.5 44 L 61 42.5" stroke={hairColor} strokeWidth="1" strokeLinecap="round" />

            {/* Tiny Traditional Bindi / Beauty mark */}
            <circle cx="50" cy="41" r="1.1" fill="#DC2626" opacity="0.75" />
          </>
        ) : (
          // MALE HAIRSTYLES
          <>
            {hairStyle === 0 && (
              // Modern taper fade / crop
              <path
                d="M 29 42 C 28 26, 38 21, 50 21 C 62 21, 72 26, 71 42 C 67 34, 60 30, 50 30 C 40 30, 33 34, 29 42 Z"
                fill={hairColor}
              />
            )}

            {hairStyle === 1 && (
              // Classic side part wave
              <path
                d="M 28 44 C 27 24, 45 19, 68 23 C 72 30, 72 43, 71 44 C 67 35, 56 30, 48 30 C 38 30, 32 35, 28 44 Z"
                fill={hairColor}
              />
            )}

            {hairStyle === 2 && (
              // Pompadour / textured quiff
              <path
                d="M 29 42 C 28 24, 34 17, 50 17 C 66 17, 72 24, 71 42 C 67 32, 61 28, 50 28 C 39 28, 33 32, 29 42 Z"
                fill={hairColor}
              />
            )}

            {hairStyle === 3 && (
              // Short neat executive cut
              <path
                d="M 30 42 C 30 26, 40 23, 50 23 C 60 23, 70 26, 70 42 C 67 34, 60 31, 50 31 C 40 31, 33 34, 30 42 Z"
                fill={hairColor}
              />
            )}

            {/* Male Eyebrows (Strong, defined) */}
            <path d="M 38 41 Q 44 39 48 41" stroke={hairColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 52 41 Q 56 39 62 41" stroke={hairColor} strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Eyes */}
            <circle cx="43.5" cy="46" r="2.4" fill="#0F172A" />
            <circle cx="44.2" cy="45.2" r="0.8" fill="#FFFFFF" />
            <circle cx="56.5" cy="46" r="2.4" fill="#0F172A" />
            <circle cx="57.2" cy="45.2" r="0.8" fill="#FFFFFF" />
          </>
        )}

        {/* Nose */}
        <path d="M 49.5 48 Q 50.5 52 48.5 52" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Warm Smiling Mouth */}
        {isFemale ? (
          <path
            d="M 44.5 56 Q 50 61 55.5 56"
            stroke="#E11D48"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M 44.5 56 Q 50 61 55.5 56"
            stroke="#991B1B"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Glasses (if selected by hash) */}
        {eyewear === 1 && (
          <g stroke="#0F172A" strokeWidth="1.5" fill="none" opacity="0.85">
            <circle cx="43.5" cy="46" r="6" />
            <circle cx="56.5" cy="46" r="6" />
            <path d="M 49.5 46 L 50.5 46" />
            <path d="M 37.5 46 L 31 44" />
            <path d="M 62.5 46 L 69 44" />
          </g>
        )}
        {eyewear === 2 && (
          <g stroke="#1E293B" strokeWidth="1.6" fill="none" opacity="0.85">
            <rect x="37" y="42" width="12" height="9" rx="2" />
            <rect x="51" y="42" width="12" height="9" rx="2" />
            <path d="M 49 46 L 51 46" />
            <path d="M 37 45 L 31 43" />
            <path d="M 63 45 L 69 43" />
          </g>
        )}
      </svg>
    </div>
  );
};
