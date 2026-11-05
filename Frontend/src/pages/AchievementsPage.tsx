import React from 'react';
import type { OfficialCourse, Student, CohortStats } from '../types';
import { Avatar } from '../components/common/Avatar';
import { MilestonePill } from '../components/common/BadgePill';
import { RankMedal } from '../components/common/RankMedal';
import { 
  Award, 
  Trophy, 
  Gift, 
  CheckCircle, 
  Crown, 
  ExternalLink,
  Flame,
  Sparkles
} from 'lucide-react';

interface AchievementsPageProps {
  stats: CohortStats;
  students: Student[];
  officialCourses: OfficialCourse[];
  onSelectStudent: (studentId: string) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  stats,
  students,
  officialCourses,
  onSelectStudent
}) => {
  const milestone3Champions = students.filter(s => s.milestone === 'Milestone 3');

  // Configured Reward Tiers for Google Cloud Learn with Communities
  const rewardTiers = [
    {
      id: 'tier-3',
      name: 'Champion Tier (Milestone 3)',
      milestone: 'Milestone 3',
      badgeCount: '10 Badges',
      accentBg: 'bg-amber-500/10 text-amber-800 border-amber-300',
      icon: Crown,
      perks: [
        'Exclusive Google Cloud Swag Pack (T-shirt, bottle, stickers)',
        'Verified Certificate of Cloud Excellence from GDG On Campus',
        'Direct Recommendation for Cloud & AI Internship Opportunities',
        'Featured profile on GDG NECN Hall of Champions',
        'Priority access to upcoming Hackathons & DevFests'
      ]
    },
    {
      id: 'tier-2',
      name: 'Specialist Tier (Milestone 2)',
      milestone: 'Milestone 2',
      badgeCount: '5-9 Badges',
      accentBg: 'bg-blue-500/10 text-blue-800 border-blue-300',
      icon: Trophy,
      perks: [
        'Official Google Cloud Water Bottle & Merchandise Pack',
        'GDG On Campus Certificate of Achievement',
        'LinkedIn Skill Endorsement from Campus Mentors',
        'Access to Advanced GenAI & Agent Mentorship Tracks'
      ]
    },
    {
      id: 'tier-1',
      name: 'Explorer Tier (Milestone 1)',
      milestone: 'Milestone 1',
      badgeCount: '2 Badges',
      accentBg: 'bg-cyan-500/10 text-cyan-800 border-cyan-300',
      icon: Award,
      perks: [
        'Digital Certificate of Participation',
        'GDG NECN Community Badge & Recognition',
        'Access to Cloud Study Jams & Peer Learning Circles'
      ]
    }
  ];

  return (
    <div className="space-y-12 pt-20 sm:pt-24">
      {/* HEADER */}
      <div className="border-b border-slate-200/80 pb-5 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>RECOGNITION & REWARDS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Achievements & Rewards Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Celebrating the hard work and technical credentials earned by our students. Verified skill badges, milestone completion benefits, and official swag threshold criteria.
        </p>
      </div>

      {/* WALL OF CHAMPIONS - MILESTONE 3 LEADERS (NEOMORPHIC CARDS) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>WALL OF CHAMPIONS (MILESTONE 3)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Elite 10-Badge Master Achievers ({milestone3Champions.length})
            </h2>
          </div>
          <span className="text-xs text-amber-800 font-mono font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
            Maximum 820 Points Tier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestone3Champions.map(champ => (
            <div
              key={champ.id}
              onClick={() => onSelectStudent(champ.id)}
              className="p-5 rounded-2xl bg-white/85 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,43,112,0.05),4px_4px_14px_#D0DCED,-4px_-4px_14px_#FFFFFF] border border-white/95 hover:-translate-y-1 cursor-pointer transition-all duration-300 group space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={champ.fullName} rank={champ.rank} size="md" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {champ.fullName}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">
                      {champ.id}
                    </span>
                  </div>
                </div>
                {champ.rank <= 3 ? (
                  <RankMedal rank={champ.rank as 1 | 2 | 3} size="sm" />
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                    #{champ.rank}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Skill Badges:</span>
                <span className="font-mono font-bold text-amber-700">{champ.skillBadgeCount}/10</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Verified Points:</span>
                <span className="font-mono font-black text-slate-900">{champ.points} pts</span>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <MilestonePill milestone={champ.milestone} size="sm" />
                <span className="text-[10px] font-semibold text-blue-600 group-hover:underline">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REWARD TIERS & SWAG CRITERIA (NEOMORPHIC CARDS) */}
      <section className="space-y-5">
        <div className="border-b border-slate-200/80 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Gift className="w-4 h-4 text-blue-600" />
            <span>OFFICIAL PROGRAM PERKS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Swag & Reward Eligibility Tiers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rewards are distributed by GDG On Campus NECN upon program closing verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewardTiers.map(tier => {
            const Icon = tier.icon;
            return (
              <div 
                key={tier.id} 
                className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_10px_32px_rgba(20,43,112,0.06),6px_6px_18px_#D0DCED,-6px_-6px_18px_#FFFFFF] border border-white/95 space-y-4 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {tier.badgeCount} Required
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">
                      {tier.name}
                    </h3>
                  </div>
                  <div className="p-2.5 rounded-2xl neo-inset text-amber-600">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Included Benefits:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {tier.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OFFICIAL 10 SKILL BADGES CATALOG (NEOMORPHIC CARDS) */}
      <section className="space-y-5">
        <div className="border-b border-slate-200/80 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>CREDENTIAL CATALOG</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            The 10 Official Google Cloud Skill Badges
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Each completed badge awards +50 points on the verified leaderboard and unlocks technical milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialCourses.map(course => {
            const count = students.filter(s => s.skillBadges.some(b => b.includes(course.badgeName) || course.badgeName.includes(b))).length;

            return (
              <div 
                key={course.id} 
                className="p-5 rounded-2xl bg-[#F0F4F9] shadow-[6px_6px_16px_#D0DCED,-6px_-6px_16px_#FFFFFF] border border-white/85 hover:-translate-y-0.5 hover:shadow-[8px_8px_20px_#CAD7E8,-8px_-8px_20px_#FFFFFF] transition-all duration-300 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl neo-inset text-blue-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      #{course.courseNumber}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">
                        {course.category}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        {course.badgeName}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-200/60">
                  <span className="text-slate-600">
                    Cohort Completers: <strong className="text-slate-900 font-bold">{count}</strong> students
                  </span>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-bold"
                  >
                    <span>Lab Details</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
