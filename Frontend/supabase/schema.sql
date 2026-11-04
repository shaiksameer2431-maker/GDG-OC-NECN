-- ==============================================================================
-- GDG On Campus | Narayana Engineering College, Nellore (NECN)
-- Program: Google Cloud Learn with Communities 2026
-- Project: NECN CLOUD CHAMPIONS
-- Supabase / PostgreSQL Production Schema & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COURSES TABLE (The 10 Official Google Cloud Skills Courses)
CREATE TABLE IF NOT EXISTS public.courses (
    id SERIAL PRIMARY KEY,
    course_order INTEGER NOT NULL UNIQUE,
    course_name TEXT NOT NULL,
    course_url TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    estimated_hours TEXT DEFAULT '4h',
    badge_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Official 10 Courses
INSERT INTO public.courses (course_order, course_name, course_url, category, icon_name, estimated_hours, badge_name)
VALUES
    (1, 'The Basics of Google Cloud Compute', 'https://www.skills.google/course_templates/754', 'Compute & Infrastructure', 'Server', '4h', 'The Basics of Google Cloud Compute'),
    (2, 'Configure Service Accounts and IAM Roles for Google Cloud', 'https://www.skills.google/course_templates/702', 'Security & IAM', 'ShieldCheck', '5h', 'Configure Service Accounts and IAM Roles for Google Cloud'),
    (3, 'Implement Speech and Language Solutions with Pre-trained APIs', 'https://www.skills.google/course_templates/700', 'AI & Speech', 'Mic', '4h', 'Implement Speech and Language Solutions with Pre-trained APIs'),
    (4, 'Develop AI-Powered Prototypes in Google AI Studio', 'https://www.skills.google/course_templates/1426', 'Generative AI', 'Sparkles', '3h', 'Develop AI-Powered Prototypes in Google AI Studio'),
    (5, 'Analyze Images with the Cloud Vision API', 'https://www.skills.google/course_templates/633', 'Computer Vision', 'Image', '4h', 'Analyze Images with the Cloud Vision API'),
    (6, 'Build a Website on Google Cloud', 'https://www.skills.google/course_templates/638', 'Web & Hosting', 'Globe', '5h', 'Build a Website on Google Cloud'),
    (7, 'Create Your First Gemini Enterprise Application', 'https://www.skills.google/course_templates/1586/', 'Enterprise AI', 'Bot', '6h', 'Create Your First Gemini Enterprise Application'),
    (8, 'Store, Process, and Manage Data on Google Cloud - Console', 'https://www.skills.google/course_templates/658', 'Data & Databases', 'Database', '5h', 'Store, Process, and Manage Data on Google Cloud - Console'),
    (9, 'Using the Google Cloud Speech API', 'https://www.skills.google/course_templates/756', 'Audio & NLP', 'Volume2', '3h', 'Using the Google Cloud Speech API'),
    (10, 'Explore Generative AI in Agent Platform', 'https://www.skills.google/course_templates/959', 'Autonomous Agents', 'Cpu', '4h', 'Explore Generative AI in Agent Platform')
ON CONFLICT (course_order) DO UPDATE 
SET course_name = EXCLUDED.course_name,
    course_url = EXCLUDED.course_url,
    category = EXCLUDED.category,
    badge_name = EXCLUDED.badge_name;

-- 2. PUBLIC STUDENTS TABLE (Contains verified achievements; ZERO access codes or emails)
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY, -- e.g. 'necn-001'
    full_name TEXT NOT NULL,
    google_skills_profile_url TEXT DEFAULT '',
    google_skills_profile_status TEXT DEFAULT 'Not applicable',
    google_developer_profile_url TEXT DEFAULT '',
    google_developer_profile_status TEXT DEFAULT 'Not applicable',
    redemption_status TEXT NOT NULL CHECK (redemption_status IN ('Redeemed', 'Not Redeemed')),
    milestone_completed TEXT NOT NULL DEFAULT 'No Milestone',
    gear_badges TEXT DEFAULT 'Not applicable',
    skill_badge_count INTEGER NOT NULL DEFAULT 0,
    calculated_points INTEGER NOT NULL DEFAULT 0,
    current_rank INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_rank ON public.students (current_rank);
CREATE INDEX IF NOT EXISTS idx_students_points ON public.students (calculated_points DESC);
CREATE INDEX IF NOT EXISTS idx_students_milestone ON public.students (milestone_completed);
CREATE INDEX IF NOT EXISTS idx_students_redemption ON public.students (redemption_status);
CREATE INDEX IF NOT EXISTS idx_students_badge_count ON public.students (skill_badge_count DESC);
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students (full_name);

-- 3. PRIVATE ADMIN VAULT (Strictly restricted to authenticated admins)
CREATE TABLE IF NOT EXISTS public.student_private_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
    user_email TEXT NOT NULL,
    access_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_student ON public.student_private_vault (student_id);
CREATE INDEX IF NOT EXISTS idx_vault_email ON public.student_private_vault (user_email);

-- 4. SKILL BADGES TABLE (Individual badges earned by students)
CREATE TABLE IF NOT EXISTS public.skill_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_badge UNIQUE (student_id, badge_name)
);

CREATE INDEX IF NOT EXISTS idx_skill_badges_student ON public.skill_badges (student_id);
CREATE INDEX IF NOT EXISTS idx_skill_badges_name ON public.skill_badges (badge_name);

-- 5. STUDENT COURSE PROGRESS (Individual tracking for the 10 courses)
CREATE TABLE IF NOT EXISTS public.student_course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Not Tracked' CHECK (status IN ('Not Tracked', 'Not Started', 'In Progress', 'Completed')),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT DEFAULT 'system',
    CONSTRAINT unique_student_course UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_student ON public.student_course_progress (student_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_status ON public.student_course_progress (status);

-- 6. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Super Admin placeholder
INSERT INTO public.admin_users (email, full_name, role)
VALUES ('gdg.necn@narayanagroup.com', 'NECN GDG Lead', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- 7. IMPORT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.import_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'CSV',
    inserted_count INTEGER NOT NULL DEFAULT 0,
    updated_count INTEGER NOT NULL DEFAULT 0,
    unchanged_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    error_summary JSONB DEFAULT '[]'::jsonb,
    imported_by TEXT DEFAULT 'admin',
    imported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial record for 04 Nov import
INSERT INTO public.import_history (filename, file_type, inserted_count, updated_count, unchanged_count, rejected_count, imported_by)
VALUES ('GDGC-NECNL [04 Nov].csv', 'CSV', 438, 0, 0, 0, 'system');

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_private_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_history ENABLE ROW LEVEL SECURITY;

-- 1. Courses: Public can read all courses
CREATE POLICY "Public can view courses"
ON public.courses FOR SELECT
USING (true);

-- 2. Students: Public can view verified student profiles (no private fields exist on this table)
CREATE POLICY "Public can view students"
ON public.students FOR SELECT
USING (true);

CREATE POLICY "Admins can insert/update students"
ON public.students FOR ALL
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

-- 3. Student Private Vault: Only authenticated admins can read or modify
CREATE POLICY "Only admins can view private vault"
ON public.student_private_vault FOR SELECT
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

CREATE POLICY "Only admins can modify private vault"
ON public.student_private_vault FOR ALL
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

-- 4. Skill Badges: Public can read
CREATE POLICY "Public can view skill badges"
ON public.skill_badges FOR SELECT
USING (true);

-- 5. Student Course Progress: Public can read
CREATE POLICY "Public can view course progress"
ON public.student_course_progress FOR SELECT
USING (true);

CREATE POLICY "Admins can modify course progress"
ON public.student_course_progress FOR ALL
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

-- 6. Import History: Only admins can view
CREATE POLICY "Only admins can view import history"
ON public.import_history FOR ALL
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

-- 7. Admin Users: Only admins can view admin list
CREATE POLICY "Only admins can view admin list"
ON public.admin_users FOR SELECT
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

