CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student', 'interviewer')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  roll_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  branch TEXT NOT NULL,
  parsed_name TEXT,
  parsed_email TEXT,
  parsed_phone TEXT,
  cgpa DECIMAL(4,2),
  tenth_percentage DECIMAL(5,2),
  twelfth_percentage DECIMAL(5,2),
  university TEXT,
  degree TEXT,
  graduation_year INTEGER,
  backlogs_current INTEGER DEFAULT 0,
  skills TEXT[] DEFAULT '{}',
  skill_categories JSONB DEFAULT '{}',
  resume_raw_text TEXT,
  resume_parsed_data JSONB DEFAULT '{}',
  resume_url TEXT,
  resume_uploaded_at TIMESTAMPTZ,
  video_url TEXT,
  video_uploaded_at TIMESTAMPTZ,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  trust_score DECIMAL(5,2) DEFAULT 0,
  trust_breakdown JSONB DEFAULT '{}',
  resume_fingerprint TEXT,
  skill_authenticity JSONB DEFAULT '{}',
  readiness_score DECIMAL(5,2) DEFAULT 0,
  percentile_overall DECIMAL(5,2) DEFAULT 0,
  percentile_skills DECIMAL(5,2) DEFAULT 0,
  percentile_projects DECIMAL(5,2) DEFAULT 0,
  percentile_experience DECIMAL(5,2) DEFAULT 0,
  placement_status TEXT DEFAULT 'unplaced' CHECK (placement_status IN ('unplaced', 'placed', 'dream_eligible')),
  placed_company TEXT,
  placed_ctc DECIMAL(10,2),
  placed_at TIMESTAMPTZ,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_link TEXT,
  live_link TEXT,
  is_team_project BOOLEAN DEFAULT false,
  team_size INTEGER DEFAULT 1,
  duration TEXT,
  detail_score DECIMAL(5,2) DEFAULT 0,
  has_links BOOLEAN DEFAULT false,
  tech_stack_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuing_organization TEXT,
  credential_url TEXT,
  issue_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  start_date TEXT,
  end_date TEXT,
  duration_months INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plagiarism_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_a_id UUID REFERENCES students(id),
  student_b_id UUID REFERENCES students(id),
  match_type TEXT NOT NULL,
  similarity_score DECIMAL(5,2) NOT NULL,
  details JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dismissed')),
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  company_type TEXT CHECK (company_type IN ('product', 'service', 'startup', 'mnc', 'government', 'other')),
  description TEXT,
  headquarters TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  source TEXT DEFAULT 'jd_parsed',
  total_visits INTEGER DEFAULT 0,
  total_hires INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  academic_year TEXT DEFAULT '2025-26',
  drive_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'screening', 'scheduling', 'interviewing', 'completed', 'cancelled')),
  jd_raw_text TEXT,
  jd_parsed_data JSONB DEFAULT '{}',
  jd_quality_score DECIMAL(5,2) DEFAULT 0,
  jd_quality_details JSONB DEFAULT '{}',
  job_role TEXT NOT NULL,
  job_description TEXT,
  job_type TEXT DEFAULT 'full_time',
  ctc_offered DECIMAL(10,2),
  ctc_breakdown TEXT,
  bond_details TEXT,
  job_location TEXT,
  eligible_departments TEXT[] DEFAULT '{}',
  min_cgpa DECIMAL(4,2) DEFAULT 0,
  max_backlogs INTEGER DEFAULT 0,
  min_tenth DECIMAL(5,2) DEFAULT 0,
  min_twelfth DECIMAL(5,2) DEFAULT 0,
  allowed_status TEXT[] DEFAULT ARRAY['unplaced'],
  must_have_skills JSONB DEFAULT '[]',
  good_to_have_skills JSONB DEFAULT '[]',
  num_panels INTEGER DEFAULT 1,
  interview_duration INTEGER DEFAULT 20,
  buffer_minutes INTEGER DEFAULT 5,
  interview_start_time TIME,
  interview_end_time TIME,
  break_after_count INTEGER DEFAULT 4,
  break_duration INTEGER DEFAULT 15,
  rooms TEXT[] DEFAULT '{}',
  weight_technical INTEGER DEFAULT 30,
  weight_problem_solving INTEGER DEFAULT 25,
  weight_communication INTEGER DEFAULT 20,
  weight_project_depth INTEGER DEFAULT 15,
  weight_cultural_fit INTEGER DEFAULT 10,
  selection_target INTEGER,
  total_eligible INTEGER DEFAULT 0,
  total_applied INTEGER DEFAULT 0,
  total_shortlisted INTEGER DEFAULT 0,
  total_interviewed INTEGER DEFAULT 0,
  total_selected INTEGER DEFAULT 0,
  autopilot_used BOOLEAN DEFAULT false,
  autopilot_config JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drive_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES drives(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  is_eligible BOOLEAN DEFAULT false,
  eligibility_details JSONB DEFAULT '{}',
  match_score DECIMAL(5,2) DEFAULT 0,
  skill_match DECIMAL(5,2) DEFAULT 0,
  project_relevance DECIMAL(5,2) DEFAULT 0,
  academic_fit DECIMAL(5,2) DEFAULT 0,
  experience_score DECIMAL(5,2) DEFAULT 0,
  interest_alignment DECIMAL(5,2) DEFAULT 0,
  match_breakdown JSONB DEFAULT '{}',
  trust_score_at_application DECIMAL(5,2) DEFAULT 0,
  placement_probability DECIMAL(5,2) DEFAULT 0,
  red_flags JSONB DEFAULT '[]',
  suggested_questions JSONB DEFAULT '[]',
  skill_authenticity_snapshot JSONB DEFAULT '{}',
  screening_status TEXT DEFAULT 'pending' CHECK (screening_status IN ('pending', 'shortlisted', 'waitlisted', 'filtered_out', 'override_included')),
  screening_notes TEXT,
  screened_by UUID,
  screened_at TIMESTAMPTZ,
  interview_status TEXT DEFAULT 'not_scheduled' CHECK (interview_status IN ('not_scheduled', 'scheduled', 'in_progress', 'completed', 'no_show', 'cancelled')),
  final_status TEXT DEFAULT 'pending' CHECK (final_status IN ('pending', 'selected', 'waitlisted', 'rejected', 'offer_accepted', 'offer_declined')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(drive_id, student_id)
);

CREATE TABLE interview_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES drives(id) ON DELETE CASCADE,
  application_id UUID REFERENCES drive_applications(id),
  student_id UUID REFERENCES students(id),
  panel_number INTEGER NOT NULL,
  slot_number INTEGER NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  room TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'no_show', 'cancelled')),
  is_standby BOOLEAN DEFAULT false,
  standby_priority INTEGER,
  promoted_via TEXT CHECK (promoted_via IN ('standard', 'smart_diversity')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE interview_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES drives(id) ON DELETE CASCADE,
  application_id UUID REFERENCES drive_applications(id),
  student_id UUID REFERENCES students(id),
  slot_id UUID REFERENCES interview_slots(id),
  interviewer_id UUID REFERENCES profiles(id),
  panel_number INTEGER,
  technical_score DECIMAL(4,2),
  problem_solving_score DECIMAL(4,2),
  communication_score DECIMAL(4,2),
  project_depth_score DECIMAL(4,2),
  cultural_fit_score DECIMAL(4,2),
  weighted_total DECIMAL(5,2),
  final_combined_score DECIMAL(5,2),
  decision TEXT CHECK (decision IN ('strong_select', 'select', 'waitlist', 'reject')),
  strengths TEXT,
  weaknesses TEXT,
  notes TEXT,
  questions_asked JSONB DEFAULT '[]',
  video_watched BOOLEAN DEFAULT false,
  actual_duration INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  performance_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE interviewer_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES drives(id),
  interviewer_id UUID REFERENCES profiles(id),
  panel_number INTEGER,
  total_interviews INTEGER DEFAULT 0,
  avg_score DECIMAL(4,2) DEFAULT 0,
  score_trend JSONB DEFAULT '[]',
  duration_trend JSONB DEFAULT '[]',
  bias_alert BOOLEAN DEFAULT false,
  bias_details TEXT,
  fatigue_alert BOOLEAN DEFAULT false,
  fatigue_details TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES drives(id),
  student_id UUID REFERENCES students(id),
  application_id UUID REFERENCES drive_applications(id),
  result TEXT NOT NULL,
  score_breakdown JSONB DEFAULT '{}',
  improvement_areas JSONB DEFAULT '[]',
  recommended_resources JSONB DEFAULT '[]',
  performance_category TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_dept ON students(department);
CREATE INDEX idx_students_trust ON students(trust_score DESC);
CREATE INDEX idx_students_status ON students(placement_status);
CREATE INDEX idx_students_fingerprint ON students(resume_fingerprint);
CREATE INDEX idx_drives_status ON drives(status);
CREATE INDEX idx_drives_date ON drives(drive_date);
CREATE INDEX idx_applications_drive ON drive_applications(drive_id);
CREATE INDEX idx_applications_student ON drive_applications(student_id);
CREATE INDEX idx_applications_score ON drive_applications(match_score DESC);
CREATE INDEX idx_plagiarism_active ON plagiarism_records(status) WHERE status = 'active';
CREATE INDEX idx_slots_drive ON interview_slots(drive_id);
CREATE INDEX idx_evaluations_drive ON interview_evaluations(drive_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE plagiarism_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviewer_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_feedback ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "read_own_or_admin" ON profiles
  FOR SELECT USING (id = auth.uid() OR get_user_role() = 'admin');
CREATE POLICY "update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "insert_own" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "student_select" ON students
  FOR SELECT USING (profile_id = auth.uid() OR get_user_role() IN ('admin', 'interviewer'));
CREATE POLICY "student_insert" ON students
  FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "student_update" ON students
  FOR UPDATE USING (profile_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "parsed_data_select" ON student_projects
  FOR SELECT USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_user_role() IN ('admin', 'interviewer'));
CREATE POLICY "parsed_data_manage" ON student_projects
  FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_user_role() = 'admin');

CREATE POLICY "certs_access" ON student_certifications
  FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_user_role() IN ('admin', 'interviewer'));
CREATE POLICY "exp_access" ON student_experiences
  FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_user_role() IN ('admin', 'interviewer'));

CREATE POLICY "plagiarism_admin" ON plagiarism_records
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "companies_read" ON companies FOR SELECT USING (true);
CREATE POLICY "companies_admin" ON companies
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "drives_read" ON drives FOR SELECT USING (true);
CREATE POLICY "drives_admin" ON drives
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "apps_read" ON drive_applications
  FOR SELECT USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_user_role() IN ('admin', 'interviewer'));
CREATE POLICY "apps_student_insert" ON drive_applications
  FOR INSERT WITH CHECK (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()));
CREATE POLICY "apps_admin_manage" ON drive_applications
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "slots_access" ON interview_slots
  FOR SELECT USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_user_role() IN ('admin', 'interviewer'));
CREATE POLICY "slots_admin" ON interview_slots
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "eval_access" ON interview_evaluations
  FOR ALL USING (get_user_role() IN ('admin', 'interviewer'));

CREATE POLICY "metrics_access" ON interviewer_metrics
  FOR ALL USING (get_user_role() IN ('admin', 'interviewer'));

CREATE POLICY "feedback_student" ON student_feedback
  FOR SELECT USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_user_role() = 'admin');
CREATE POLICY "feedback_admin" ON student_feedback
  FOR ALL USING (get_user_role() = 'admin');
