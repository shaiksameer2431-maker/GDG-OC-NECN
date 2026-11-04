import React, { useState, useEffect } from 'react';
import { Trophy, Compass, Award, Info, Menu, X, CheckCircle, Sparkles } from 'lucide-react';
import type { CohortStats } from '../../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  stats: CohortStats;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, stats }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Public navigation links (Admin module is completely separated)
  const navLinks = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'journey', label: 'Learning Journey', icon: Compass },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 sm:pt-5 transition-all duration-300 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-3 px-3.5 sm:px-5 py-2.5 rounded-full border transition-all duration-300 max-w-6xl w-full ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-2xl border-slate-200 shadow-md'
            : 'bg-white/85 backdrop-blur-xl border-slate-200/80 shadow-sm'
        }`}
      >
        {/* Brand / Logo */}
        <button
          onClick={() => {
            onTabChange('overview');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          {/* Official GDG Brackets Logo */}
          <div className="relative w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
            <img
              src="/gdg-brackets-logo.png"
              alt="GDG On Campus"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="hidden min-[420px]:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                NECN CLOUD CHAMPIONS
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                2026
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate max-w-[170px] sm:max-w-none">
              GDG On Campus • Narayana Engineering College
            </p>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Info Pill & Mobile Menu Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live redemption count pill */}
          <button
            onClick={() => onTabChange('leaderboard')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-all shadow-xs"
            title="Access Codes Redeemed"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono">{stats.redeemedCount}/{stats.totalRegistered}</span>
            <span className="text-[10px] text-emerald-700 hidden sm:inline">({stats.redemptionPercentage}%)</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden fixed inset-x-4 top-20 p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl flex flex-col gap-2 animate-fadeIn z-50">
          <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-1">
            Navigation Menu
          </div>

          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => {
                  onTabChange(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span>{link.label}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs px-3 text-slate-500">
            <span>Redemption Progress:</span>
            <span className="font-mono text-emerald-700 font-bold">{stats.redeemedCount} / {stats.totalRegistered} ({stats.redemptionPercentage}%)</span>
          </div>
        </div>
      )}
    </header>
  );
};
