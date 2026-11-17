// ==============================================================================
// COMMUNITY TIERS & CHAPTER MILESTONE STATUS
// GDG On Campus | Narayana Engineering College, Nellore
// Google Cloud Learn with Communities 2026
// ==============================================================================
// NOTE: This configuration tracks official community-level achievement
// announcements (e.g. Bronze Milestone: 50+ Students Completed 5 Badges),
// distinct from individual leaderboard medals (RankMedal 3rd place).
// ==============================================================================

export interface CommunityBronzeMilestoneConfig {
  milestoneTitle: string;
  collegeName: string;
  organization: string;
  program: string;
  badgeThreshold: number;
  studentTarget: number;
  actualStudentsCompleted5Plus: number;
  tagline: {
    prefix: string;
    learn: string;
    build: string;
    grow: string;
  };
  colors: {
    background: string;
    cardBg: string;
    bronzeAccent: string;
    bronzeDark: string;
    bronzeHighlight: string;
    googleBlue: string;
    googleRed: string;
    googleYellow: string;
    googleGreen: string;
  };
}

export const COMMUNITY_BRONZE_MILESTONE: CommunityBronzeMilestoneConfig = {
  milestoneTitle: 'BRONZE MILESTONE ACHIEVED',
  collegeName: 'Narayana Engineering College, Nellore',
  organization: 'GDG on Campus – Narayana Engineering College, Nellore',
  program: 'Google Cloud Learn with Communities 2026',
  badgeThreshold: 5,
  studentTarget: 50,
  // Authoritative verified records: 59 Milestone 3 (10 badges) + 10 Milestone 2 (5-9 badges) = 69 students
  actualStudentsCompleted5Plus: 69,
  tagline: {
    prefix: 'Together, we',
    learn: 'Learn.',
    build: 'Build.',
    grow: 'Grow.',
  },
  colors: {
    background: '#F8F8FA',
    cardBg: '#FFFFFF',
    bronzeAccent: '#B87345',
    bronzeDark: '#7A4320',
    bronzeHighlight: '#DF9B6E',
    googleBlue: '#4285F4',
    googleRed: '#EA4335',
    googleYellow: '#FBBC04',
    googleGreen: '#34A853',
  },
};

// Legacy alias for backwards compatibility
export const COMMUNITY_BRONZE_TIER = {
  ...COMMUNITY_BRONZE_MILESTONE,
  tier: 'Bronze',
  status: 'ACHIEVED',
  title: 'BRONZE MILESTONE ACHIEVED',
  subtitle: 'A Milestone Worth Celebrating',
  description: 'Celebrate the collective efforts of our student community.',
  minMilestones: 50,
  minBadges: 500,
  achievedMilestones: 77,
  achievedBadges: 725,
  activeChampions: 228,
  colors: {
    deepBronze: '#3B2418',
    metallicBronze: '#B87345',
    copper: '#C47A45',
    highlight: '#DF9B6E',
    darkBackground: '#17120F',
    surfaceElevated: '#231A14',
    borderGlow: 'rgba(184, 115, 69, 0.45)',
  },
};
