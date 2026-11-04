// ==============================================================================
// NECN CLOUD CHAMPIONS - Strong TypeScript Types
// GDG On Campus | Narayana Engineering College, Nellore
// ==============================================================================

export type RedemptionStatus = 'Redeemed' | 'Not Redeemed';

export type MilestoneType = 'Milestone 1' | 'Milestone 2' | 'Milestone 3' | 'No Milestone';

export type CourseStatus = 'Not Tracked' | 'Not Started' | 'In Progress' | 'Completed';

export interface CourseProgressItem {
  courseId: number;
  courseTitle: string;
  status: CourseStatus;
  completedAt?: string | null;
  notes?: string;
}

export interface Student {
  id: string; // e.g., 'necn-001'
  fullName: string;
  googleSkillsProfileUrl: string;
  googleSkillsProfileStatus: string;
  googleDeveloperProfileUrl: string;
  googleDeveloperProfileStatus: string;
  redemptionStatus: RedemptionStatus;
  milestone: MilestoneType;
  gearBadges: string;
  skillBadgeCount: number;
  skillBadges: string[];
  points: number;
  rank: number;
  courseProgress: CourseProgressItem[];
  updatedAt?: string;
}

export interface AdminVaultRecord {
  studentId: string;
  fullName: string;
  email: string;
  accessCode: string;
  redemptionStatus: RedemptionStatus;
  importedAt: string;
}

export interface OfficialCourse {
  id: number;
  courseNumber: string;
  title: string;
  url: string;
  category: string;
  iconName: string;
  estimatedHours: string;
  badgeName: string;
  description?: string;
}

export interface ImportLog {
  id: string;
  filename: string;
  fileType: 'CSV' | 'XLSX';
  insertedCount: number;
  updatedCount: number;
  unchangedCount: number;
  rejectedCount: number;
  importedAt: string;
  importedBy: string;
  errorSummary?: string[];
}

export interface LeaderboardFilters {
  searchQuery: string;
  redemption: 'all' | 'redeemed' | 'not-redeemed';
  milestone: 'all' | 'Milestone 3' | 'Milestone 2' | 'Milestone 1' | 'No Milestone';
  badgeRange: 'all' | '10' | '5-9' | '1-4' | '0';
  sortBy: 'rank' | 'points' | 'badges' | 'milestone' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface CohortStats {
  totalRegistered: number;
  redeemedCount: number;
  notRedeemedCount: number;
  redemptionPercentage: number;
  totalSkillBadges: number;
  milestone1Count: number;
  milestone2Count: number;
  milestone3Count: number;
  totalMilestonesCount: number;
  averageBadgesPerStudent: number;
  tenBadgesAchieversCount: number;
}

export interface RewardTier {
  id: string;
  name: string;
  milestoneRequired: MilestoneType | '10 Badges';
  badgeCountRequired: number;
  perks: string[];
  swagDetails: string;
  badgeColor: string;
}

