import React from 'react';
import type { Student, CohortStats } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Avatar } from '../components/common/Avatar';
import { MilestonePill } from '../components/common/BadgePill';
import { HeroBannerDesign } from '../components/common/HeroBannerDesign';
import { RankMedal } from '../components/common/RankMedal';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Award, 
  Trophy, 
  Sparkles, 
  Compass, 
  Crown,
  ArrowRight
} from 'lucide-react';

interface OverviewPageProps {
  stats: CohortStats;
  topStudents: Student[];
  onNavigate: (tab: string, studentId?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ stats, topStudents, onNavigate }) => {
  const topThree = topStudents.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* NATIVE REDESIGNED HERO BANNER SECTION (NOT A STATIC IMAGE - PURE INTERACTIVE DESIGN) */}
      <section className="relative pt-20 sm:pt-24 pb-2">
        {/* Soft pastel ambient gradient behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-blue-100/70 via-sky-100/50 to-amber-100/40 blur-[90px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-1 sm:px-2">
          <HeroBannerDesign
            onExploreLeaderboard={() => onNavigate('leaderboard')}
            onExploreJourney={() => onNavigate('journey')}
          />
        </div>
      </section>

      {/* LIVE COHORT STATISTICS GRID */}
      <section className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-700 font-bold">
            REAL-TIME COHORT METRICS
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Live Program Performance Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Registered"
            value={stats.totalRegistered}
            subtitle="Total Students"
            icon={Users}
            iconColor="text-blue-600"
            glowColor="blue"
          />
          <StatCard
            title="Redeemed"
            value={stats.redeemedCount}
            subtitle="Codes Activated"
            icon={CheckCircle}
            iconColor="text-emerald-600"
            glowColor="emerald"
            trend={`${stats.redemptionPercentage}%`}
          />
          <StatCard
            title="Pending"
            value={stats.notRedeemedCount}
            subtitle="Pending Activation"
            icon={Clock}
            iconColor="text-amber-600"
            glowColor="amber"
          />
          <StatCard
            title="Skill Badges"
            value={stats.totalSkillBadges}
            subtitle="Earned in Total"
            icon={Award}
            iconColor="text-amber-500"
            glowColor="gold"
          />
          <StatCard
            title="Milestones"
            value={stats.totalMilestonesCount}
            subtitle="M1, M2 & M3"
            icon={Trophy}
            iconColor="text-indigo-600"
            glowColor="blue"
            trend={`${stats.milestone3Count} M3`}
          />
          <StatCard
            title="Redemption"
            value={`${stats.redemptionPercentage}%`}
            subtitle="Overall Rate"
            icon={Sparkles}
            iconColor="text-cyan-600"
            glowColor="blue"
          />
        </div>
      </section>

      {/* TOP THREE ACHIEVERS PODIUM */}
      {topThree.length >= 3 && (
        <section className="space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-300 text-amber-800">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>COHORT LEADERSHIP PODIUM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Cloud Champions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Recognizing the top student achievers with the highest verified points, milestone completions, and skill credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6 max-w-4xl mx-auto">
            {/* Rank 2 - Silver */}
            <div className="order-2 md:order-1 relative p-1 rounded-3xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-6 rounded-[calc(1.5rem-0.125rem)] bg-gradient-to-b from-[#F0F4F9] to-white/70 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar name={topThree[1].fullName} rank={2} size="xl" />
                  <RankMedal rank={2} size="md" className="absolute -bottom-3.5 inset-x-0 mx-auto" />
                </div>

                <div className="pt-2 space-y-1">
                  <h3 className="text-base font-bold text-slate-900 truncate max-w-[200px]" title={topThree[1].fullName}>
                    {topThree[1].fullName}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <MilestonePill milestone={topThree[1].milestone} />
                  </div>
                </div>

                <div className="w-full pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Points</span>
                    <p className="font-mono font-bold text-blue-600">{topThree[1].points}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Badges</span>
                    <p className="font-mono font-bold text-amber-600">{topThree[1].skillBadgeCount}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('students', topThree[1].id)}
                  className="w-full py-2.5 px-3 rounded-xl neo-btn text-xs font-bold text-slate-800 transition-all active:scale-95"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Rank 1 - Gold (Elevated) */}
            <div className="order-1 md:order-2 relative p-1.5 rounded-3xl bg-[#F0F4F9] shadow-[12px_12px_28px_#CAD7E8,-12px_-12px_28px_#FFFFFF] border-2 border-amber-300/80 transition-all duration-300 hover:scale-[1.03] md:-translate-y-4">
              <div className="p-6 rounded-[calc(1.5rem-0.125rem)] bg-gradient-to-b from-amber-50/50 via-[#F0F4F9] to-white/90 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar name={topThree[0].fullName} rank={1} size="xl" />
                  <RankMedal rank={1} size="lg" className="absolute -bottom-4 inset-x-0 mx-auto" />
                </div>

                <div className="pt-3 space-y-1">
                  <h3 className="text-lg font-black text-slate-900 truncate max-w-[220px]" title={topThree[0].fullName}>
                    {topThree[0].fullName}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <MilestonePill milestone={topThree[0].milestone} />
                  </div>
                </div>

                <div className="w-full pt-3 border-t border-amber-200/80 grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Points</span>
                    <p className="font-mono font-black text-amber-600 text-base">{topThree[0].points}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Badges</span>
                    <p className="font-mono font-black text-amber-600 text-base">{topThree[0].skillBadgeCount}/10</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('students', topThree[0].id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  View Champion Profile
                </button>
              </div>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="order-3 relative p-1 rounded-3xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-6 rounded-[calc(1.5rem-0.125rem)] bg-gradient-to-b from-[#F0F4F9] to-white/70 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar name={topThree[2].fullName} rank={3} size="xl" />
                  <RankMedal rank={3} size="md" className="absolute -bottom-3.5 inset-x-0 mx-auto" />
                </div>

                <div className="pt-2 space-y-1">
                  <h3 className="text-base font-bold text-slate-900 truncate max-w-[200px]" title={topThree[2].fullName}>
                    {topThree[2].fullName}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <MilestonePill milestone={topThree[2].milestone} />
                  </div>
                </div>

                <div className="w-full pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Points</span>
                    <p className="font-mono font-bold text-blue-600">{topThree[2].points}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Badges</span>
                    <p className="font-mono font-bold text-amber-600">{topThree[2].skillBadgeCount}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('students', topThree[2].id)}
                  className="w-full py-2.5 px-3 rounded-xl neo-btn text-xs font-bold text-slate-800 transition-all active:scale-95"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MILESTONE TIERS BREAKDOWN */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-700 font-bold">
            PROGRAM TIERS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Milestone Achievement Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Milestone 3 Card */}
          <div className="apple-card-outer hover:border-amber-400 hover:shadow-md transition-all">
            <div className="apple-card-inner space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                  TIER 3 (HIGHEST)
                </span>
                <span className="text-2xl font-black text-amber-600 font-mono">
                  {stats.milestone3Count} <span className="text-xs font-normal text-slate-500">Achievers</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Milestone 3</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  10 Completed Skill Badges. Highest level of program mastery with comprehensive cloud architecture and AI skills.
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(stats.milestone3Count / stats.totalRegistered) * 100 * 5}%` }}
                />
              </div>
            </div>
          </div>

          {/* Milestone 2 Card */}
          <div className="apple-card-outer hover:border-blue-400 hover:shadow-md transition-all">
            <div className="apple-card-inner space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  TIER 2 (INTERMEDIATE)
                </span>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {stats.milestone2Count} <span className="text-xs font-normal text-slate-500">Achievers</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Milestone 2</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  6 Completed Skill Badges. Demonstrates advanced cloud security, pre-trained ML APIs, and prototyping capabilities.
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${(stats.milestone2Count / stats.totalRegistered) * 100 * 5}%` }}
                />
              </div>
            </div>
          </div>

          {/* Milestone 1 Card */}
          <div className="apple-card-outer hover:border-cyan-400 hover:shadow-md transition-all">
            <div className="apple-card-inner space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                  TIER 1 (FOUNDATIONAL)
                </span>
                <span className="text-2xl font-black text-cyan-600 font-mono">
                  {stats.milestone1Count} <span className="text-xs font-normal text-slate-500">Achievers</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Milestone 1</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  2 Completed Skill Badges. Foundational Google Cloud Compute and identity architecture competency.
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${(stats.milestone1Count / stats.totalRegistered) * 100 * 5}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM HIGHLIGHT BANNER */}
      <section className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-200 shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>OFFICIAL 10-COURSE CURRICULUM</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Master Google Cloud & Generative AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From Cloud Compute basics to Gemini Enterprise Applications and Agent Platforms, track your individual lab completions directly through the official Google Skills curriculum.
            </p>
          </div>

          <button
            onClick={() => onNavigate('journey')}
            className="apple-pill-btn bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm shrink-0 py-3 px-6 text-xs sm:text-sm"
          >
            <span>Explore Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
