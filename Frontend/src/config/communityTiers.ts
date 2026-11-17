// ==============================================================================
// COMMUNITY TIERS & CHAPTER MILESTONE STATUS
// GDG On Campus | Narayana Engineering College, Nellore
// Google Cloud Learn with Communities 2026
// ==============================================================================
// NOTE: This configuration tracks collective chapter performance for the
// community recognition program, distinct from individual leaderboard medals
// (e.g., RankMedal 3rd place).
// ==============================================================================

export interface CommunityTier {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  status: 'ACHIEVED' | 'IN_PROGRESS' | 'LOCKED';
  title: string;
  subtitle: string;
  organization: string;
  program: string;
  description: string;
  minMilestones: number;
  minBadges: number;
  achievedMilestones: number;
  achievedBadges: number;
  activeChampions: number;
  colors: {
    deepBronze: string;
    metallicBronze: string;
    copper: string;
    highlight: string;
    darkBackground: string;
    surfaceElevated: string;
    borderGlow: string;
  };
}

export const COMMUNITY_BRONZE_TIER: CommunityTier = {
  tier: 'Bronze',
  status: 'ACHIEVED',
  title: 'BRONZE STATUS ACHIEVED',
  subtitle: 'A Milestone Worth Celebrating',
  organization: 'GDG ON CAMPUS NECN',
  program: 'Google Cloud Learn with Communities 2026',
  description: 'Celebrate the collective efforts of our student community.',
  // Chapter Thresholds for official Bronze Recognition
  minMilestones: 50,
  minBadges: 500,
  // Current Verified Cohort Statistics (November 17 Official Synchronized Records)
  achievedMilestones: 77, // 59 Milestone 3 + 10 Milestone 2 + 8 Milestone 1
  achievedBadges: 725,
  activeChampions: 228,
  colors: {
    deepBronze: '#3B2418',
    metallicBronze: '#A8683A',
    copper: '#C47A45',
    highlight: '#E6B27A',
    darkBackground: '#17120F',
    surfaceElevated: '#231A14',
    borderGlow: 'rgba(196, 122, 69, 0.45)',
  },
};
