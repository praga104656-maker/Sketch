export type ParticipantType = 'srm' | 'external';
export type AccountStatus = 'active' | 'suspended' | 'blocked';
export type UserRoleType = 'master_admin' | 'event_manager' | 'attendance_staff' | 'participant';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  participant_type: ParticipantType;
  institution: string;
  srm_reg_number?: string;
  department?: string;
  year?: string;
  section?: string;
  account_status: AccountStatus;
  role: UserRoleType;
  created_at: string;
}

export type EventCategory = 'Workshop' | 'Hackathon' | 'Competition' | 'Debate' | 'Tech Talk' | 'Symposium' | 'Other';
export type EventType = 'physical' | 'online' | 'hybrid';
export type EventEligibility = 'srm_only' | 'srm_external' | 'open';
export type RegistrationType = 'individual' | 'team';
export type TeamInstitutionRule = 'mixed' | 'same_institution';

export type EventLifecycleStatus =
  | 'draft'
  | 'published'
  | 'registration_open'
  | 'registration_closed'
  | 'event_live'
  | 'completed'
  | 'archived';

export interface EventQuestion {
  id: string;
  event_id: string;
  question_text: string;
  question_type: 'short_text' | 'long_text' | 'dropdown' | 'multiple_choice' | 'checkbox' | 'file_upload';
  options?: string[];
  is_required: boolean;
  sort_order: number;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  poster_url: string;
  category: EventCategory;
  organizer: string;
  contact_email: string;
  contact_phone: string;
  event_type: EventType;
  venue: string;
  building?: string;
  room?: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  reg_open_date: string;
  reg_close_date: string;
  eligibility: EventEligibility;
  registration_type: RegistrationType;
  capacity: number;
  registered_count: number;
  min_team_size: number;
  max_team_size: number;
  team_institution_rule: TeamInstitutionRule;
  lifecycle_status: EventLifecycleStatus;
  certificate_enabled: boolean;
  important_instructions?: string;
  questions?: EventQuestion[];
  created_by: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  user: Profile;
  role: 'leader' | 'member';
  joined_at: string;
}

export interface Team {
  id: string;
  event_id: string;
  team_name: string;
  team_code: string;
  leader_id: string;
  members: TeamMember[];
  created_at: string;
}

export interface Registration {
  id: string;
  registration_code: string;
  event_id: string;
  user_id: string;
  registration_type: RegistrationType;
  team_id?: string;
  team?: Team;
  status: 'confirmed' | 'cancelled';
  responses: Record<string, string>;
  created_at: string;
  event?: EventItem;
  user?: Profile;
}

export interface EventPass {
  id: string;
  registration_id: string;
  qr_token: string;
  status: 'active' | 'used' | 'invalidated';
  issued_at: string;
  registration: Registration;
}

export interface AttendanceRecord {
  id: string;
  event_id: string;
  registration_id: string;
  user_id: string;
  scanned_by: string;
  scanned_by_name: string;
  checked_in_at: string;
  status: 'checked_in' | 'manual_override';
  notes?: string;
  user?: Profile;
  event?: EventItem;
}

export interface Certificate {
  id: string;
  event_id: string;
  user_id: string;
  registration_id: string;
  certificate_number: string;
  issued_at: string;
  event_title: string;
  participant_name: string;
  participant_reg?: string;
  event_date: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  details?: Record<string, any>;
  created_at: string;
}
