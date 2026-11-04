import React from 'react';
import { 
  Info, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const faqs = [
    {
      q: "What is Google Cloud Learn with Communities 2026?",
      a: "It is an official student enablement campaign powered by Google Developers and Google Cloud. Students gain access to hands-on Google Cloud Skills Boost labs, completing quests and earning skill badges to master real cloud infrastructure, security, data, and generative AI."
    },
    {
      q: "How are student rankings calculated on the leaderboard?",
      a: "Rankings are deterministic and based strictly on verified achievements: Milestone 3 awards 300 pts, Milestone 2 awards 200 pts, Milestone 1 awards 100 pts, and each completed Skill Badge awards 50 pts, plus profile verification bonuses. Verified cohort access code redemption is required for top podium placement."
    },
    {
      q: "Why do some course modules show as 'Not Tracked'?",
      a: "The official CSV import contains verified skill badges and milestone summaries. Individual lab module completions for newly enrolled students are set to 'Not Tracked' until certified through administrator verification or student submission."
    },
    {
      q: "How are student emails and access codes kept secure?",
      a: "The portal adheres to strict privacy and data protection principles. Access codes and personal emails are never rendered in public browser views or exposed via client-side API payloads. Profiles require registered email verification to access individual achievement detail."
    }
  ];

  return (
    <div className="space-y-10 pt-20 sm:pt-24">
      {/* HEADER */}
      <div className="border-b border-slate-200/80 pb-5 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>COMMUNITY & PROGRAM DIRECTORY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          About GDG On Campus NECN
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Google Developer Groups On Campus at Narayana Engineering College, Nellore (NECN) is an active university tech community dedicated to closing the gap between academic theory and real-world software engineering.
        </p>
      </div>

      {/* INSTITUTION & CHAPTER SHOWCASE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 p-2 flex items-center justify-center shrink-0">
              <img
                src="/gdg-brackets-logo.png"
                alt="GDG On Campus"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Narayana Engineering College, Nellore
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Muthukur Road, Nellore, Andhra Pradesh, India
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Our campus chapter organizes interactive workshops, multi-week cloud study jams, Android builds, open-source cohorts, and hackathons. Through Google Cloud Learn with Communities 2026, we are guiding over 400 engineering students in cloud infrastructure, pre-trained AI APIs, and autonomous agent development.
          </p>

          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-3 text-xs font-bold">
            <a
              href="https://gdg.community.dev/gdg-on-campus-narayana-engineering-college-nellore-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn-primary px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <span>GDG Community Chapter</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://www.necn.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>College Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Pillars Card */}
        <div className="p-6 rounded-3xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Core Program Pillars</span>
          </h3>

          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">Hands-on Practice:</strong> Real cloud environments on Google Cloud Console.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">Industry Credentials:</strong> Verifiable digital badges from Google Skills Boost.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">Generative AI Focus:</strong> Gemini applications and Agent Platform labs.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="space-y-4">
        <div className="border-b border-slate-200/80 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#F0F4F9] shadow-[6px_6px_16px_#D0DCED,-6px_-6px_16px_#FFFFFF] border border-white/85 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                <span className="text-blue-600 font-mono font-black">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
