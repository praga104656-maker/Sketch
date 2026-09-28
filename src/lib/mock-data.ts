import {
  Profile,
  EventItem,
  Team,
  Registration,
  EventPass,
  AttendanceRecord,
  Certificate,
  AuditLog
} from '@/types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user-admin-1',
    full_name: 'M. Pragadeeshwaran',
    email: 'pragadeeshwaran@sketch.srmist.edu.in',
    phone: '+91 98765 43210',
    participant_type: 'srm',
    institution: 'SRM Institute of Science and Technology, Kattankulathur',
    srm_reg_number: 'RA2111003010001',
    department: 'Computer Science and Engineering',
    year: '4th Year',
    section: 'A',
    account_status: 'active',
    role: 'master_admin',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-manager-1',
    full_name: 'Harshanth K M',
    email: 'harshanth@sketch.srmist.edu.in',
    phone: '+91 98765 12345',
    participant_type: 'srm',
    institution: 'SRM Institute of Science and Technology, Kattankulathur',
    srm_reg_number: 'RA2211003010088',
    department: 'Information Technology',
    year: '3rd Year',
    section: 'B',
    account_status: 'active',
    role: 'event_manager',
    created_at: '2026-01-10T00:00:00Z'
  },
  {
    id: 'user-staff-1',
    full_name: 'Krishna Kumar',
    email: 'krishna@sketch.srmist.edu.in',
    phone: '+91 91234 56780',
    participant_type: 'srm',
    institution: 'SRM Institute of Science and Technology, Kattankulathur',
    srm_reg_number: 'RA2311003010412',
    department: 'Computer Science and Engineering',
    year: '2nd Year',
    section: 'C',
    account_status: 'active',
    role: 'attendance_staff',
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'user-srm-student',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@srmist.edu.in',
    phone: '+91 99887 76655',
    participant_type: 'srm',
    institution: 'SRM Institute of Science and Technology, Kattankulathur',
    srm_reg_number: 'RA2311003010142',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    section: 'A',
    account_status: 'active',
    role: 'participant',
    created_at: '2026-02-15T00:00:00Z'
  },
  {
    id: 'user-external-student',
    full_name: 'Diya Patel',
    email: 'diya.patel@ceg.annauniv.edu',
    phone: '+91 98450 11223',
    participant_type: 'external',
    institution: 'College of Engineering, Guindy (Anna University)',
    department: 'Information Science & Tech',
    year: '2nd Year',
    account_status: 'active',
    role: 'participant',
    created_at: '2026-03-01T00:00:00Z'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-ai-workshop',
    title: 'SKETCH AI Workshop: Generative Agents & Fine-Tuning',
    slug: 'sketch-ai-workshop-2026',
    description: 'An intensive hands-on masterclass on building autonomous AI agents, multi-modal prompting, and domain fine-tuning with open source LLMs. Live code labs and real-world deployment on cloud clusters.',
    poster_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'Workshop',
    organizer: 'SKETCH SRM Technical Wing',
    contact_email: 'ai.sketch@srmist.edu.in',
    contact_phone: '+91 98765 43210',
    event_type: 'physical',
    venue: 'Tech Park 4th Floor Audi',
    building: 'Tech Park',
    room: 'TP-402',
    event_date: '2026-09-28',
    start_time: '10:00',
    end_time: '13:00',
    reg_open_date: '2026-09-15T00:00:00Z',
    reg_close_date: '2026-09-28T09:00:00Z',
    eligibility: 'srm_external',
    registration_type: 'individual',
    capacity: 120,
    registered_count: 85,
    min_team_size: 1,
    max_team_size: 1,
    team_institution_rule: 'mixed',
    lifecycle_status: 'registration_open',
    certificate_enabled: true,
    important_instructions: 'Bring your laptop with Node.js and Python 3.10+ installed. Power strips provided at venue. Event pass QR code required for check-in at door.',
    created_by: 'user-admin-1',
    created_at: '2026-09-15T10:00:00Z',
    questions: [
      {
        id: 'q-ai-1',
        event_id: 'event-ai-workshop',
        question_text: 'What is your current experience level with Python & ML?',
        question_type: 'dropdown',
        options: ['Beginner (basics of Python)', 'Intermediate (NumPy, PyTorch/TensorFlow)', 'Advanced (Deployed LLMs in prod)'],
        is_required: true,
        sort_order: 1
      },
      {
        id: 'q-ai-2',
        event_id: 'event-ai-workshop',
        question_text: 'Will you bring a laptop with CUDA/GPU or Colab access?',
        question_type: 'dropdown',
        options: ['Yes, dedicated GPU laptop', 'Yes, will use Google Colab / Cloud', 'No, need lab machine'],
        is_required: true,
        sort_order: 2
      }
    ]
  },
  {
    id: 'event-codeforge-hackathon',
    title: 'CodeForge 2026: National 24-Hour Hackathon',
    slug: 'codeforge-2026',
    description: 'The flagship annual 24-hour hackathon by SKETCH. Build cutting-edge solutions across AI, FinTech, Healthcare, and Sustainable Tech. Mentorship from industry veterans, cash prize pool of ₹1,50,000, and direct internship opportunities.',
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    category: 'Hackathon',
    organizer: 'SKETCH Core Organizing Committee',
    contact_email: 'hackathon@sketch.srmist.edu.in',
    contact_phone: '+91 98765 12345',
    event_type: 'physical',
    venue: 'University Building (UB) Central Auditorium',
    building: 'University Building',
    room: 'UB Central Hall',
    event_date: '2026-10-15',
    start_time: '09:00',
    end_time: '09:00',
    reg_open_date: '2026-09-20T00:00:00Z',
    reg_close_date: '2026-10-10T23:59:59Z',
    eligibility: 'srm_external',
    registration_type: 'team',
    capacity: 60, // 60 teams
    registered_count: 32,
    min_team_size: 2,
    max_team_size: 4,
    team_institution_rule: 'mixed',
    lifecycle_status: 'registration_open',
    certificate_enabled: true,
    important_instructions: 'Teams must consist of 2 to 4 members. Inter-college teams are welcome. Food, high-speed WiFi, sleeping zones, and snacks provided 24/7.',
    created_by: 'user-admin-1',
    created_at: '2026-09-20T12:00:00Z',
    questions: [
      {
        id: 'q-hack-1',
        event_id: 'event-codeforge-hackathon',
        question_text: 'Target Track / Domain',
        question_type: 'dropdown',
        options: ['Autonomous AI & Agents', 'FinTech & Decentralized Systems', 'HealthTech & Bio-Informatics', 'Open Innovation & Smart Campus'],
        is_required: true,
        sort_order: 1
      },
      {
        id: 'q-hack-2',
        event_id: 'event-codeforge-hackathon',
        question_text: 'GitHub or Portfolio Links of Team Members',
        question_type: 'short_text',
        is_required: true,
        sort_order: 2
      },
      {
        id: 'q-hack-3',
        event_id: 'event-codeforge-hackathon',
        question_text: 'Brief idea summary or problem statement you intend to tackle',
        question_type: 'long_text',
        is_required: false,
        sort_order: 3
      }
    ]
  },
  {
    id: 'event-design-sprint',
    title: 'SKETCH UI/UX Design Sprint 2026',
    slug: 'sketch-ui-ux-design-sprint',
    description: 'Rapid design sprint challenge. Re-imagine everyday student applications with atomic design, micro-interactions, and accessibility. Judged by senior product designers.',
    poster_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    category: 'Competition',
    organizer: 'SKETCH Design Studio',
    contact_email: 'design@sketch.srmist.edu.in',
    contact_phone: '+91 91234 56780',
    event_type: 'physical',
    venue: 'Tech Park 702 Computer Lab',
    building: 'Tech Park',
    room: 'TP-702',
    event_date: '2026-10-02',
    start_time: '14:00',
    end_time: '17:30',
    reg_open_date: '2026-09-18T00:00:00Z',
    reg_close_date: '2026-10-01T18:00:00Z',
    eligibility: 'srm_only',
    registration_type: 'individual',
    capacity: 50,
    registered_count: 50, // Capacity full!
    min_team_size: 1,
    max_team_size: 1,
    team_institution_rule: 'same_institution',
    lifecycle_status: 'registration_open',
    certificate_enabled: true,
    important_instructions: 'Figma access required. Bring wired headphones for quiet focus work.',
    created_by: 'user-manager-1',
    created_at: '2026-09-18T10:00:00Z',
    questions: [
      {
        id: 'q-design-1',
        event_id: 'event-design-sprint',
        question_text: 'Link to your Behance, Dribbble, or Figma portfolio',
        question_type: 'short_text',
        is_required: false,
        sort_order: 1
      }
    ]
  },
  {
    id: 'event-national-debate',
    title: 'Inter-College Parliamentary Debate: Ethics in AGI',
    slug: 'inter-college-parliamentary-debate',
    description: 'High stakes debate competition on algorithmic bias, AI governance, autonomous weaponry, and intellectual property in synthetic media.',
    poster_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    category: 'Debate',
    organizer: 'SKETCH Literary & Debate Society',
    contact_email: 'debate@sketch.srmist.edu.in',
    contact_phone: '+91 98765 88990',
    event_type: 'hybrid',
    venue: 'Biotech Block Seminar Hall 1 & Zoom',
    building: 'Biotech Block',
    room: 'BT-101',
    event_date: '2026-09-24',
    start_time: '15:00',
    end_time: '18:00',
    reg_open_date: '2026-09-01T00:00:00Z',
    reg_close_date: '2026-09-23T18:00:00Z', // Expired
    eligibility: 'srm_external',
    registration_type: 'team',
    capacity: 24,
    registered_count: 24,
    min_team_size: 2,
    max_team_size: 2,
    team_institution_rule: 'mixed',
    lifecycle_status: 'registration_closed',
    certificate_enabled: true,
    important_instructions: 'Registration has officially closed.',
    created_by: 'user-admin-1',
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'event-cloud-native-microservices',
    title: 'Foundations of Cloud Native Microservices',
    slug: 'cloud-native-microservices',
    description: 'Hands-on architectural deep dive on Kubernetes clusters, service meshes, eBPF tracing, and zero-downtime rolling canary deployments.',
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category: 'Tech Talk',
    organizer: 'SKETCH Cloud Architecture Group',
    contact_email: 'cloud@sketch.srmist.edu.in',
    contact_phone: '+91 98765 43210',
    event_type: 'physical',
    venue: 'Tech Park Mini Audi',
    building: 'Tech Park',
    room: 'TP-201',
    event_date: '2026-09-10',
    start_time: '11:00',
    end_time: '13:00',
    reg_open_date: '2026-08-25T00:00:00Z',
    reg_close_date: '2026-09-09T23:59:59Z',
    eligibility: 'srm_only',
    registration_type: 'individual',
    capacity: 100,
    registered_count: 92,
    min_team_size: 1,
    max_team_size: 1,
    team_institution_rule: 'same_institution',
    lifecycle_status: 'completed',
    certificate_enabled: true,
    important_instructions: 'Completed event. Verified attendees can download their verifiable certificates.',
    created_by: 'user-admin-1',
    created_at: '2026-08-25T10:00:00Z'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-bug-slayers',
    event_id: 'event-codeforge-hackathon',
    team_name: 'BUG SLAYERS',
    team_code: 'SK-7X4P9',
    leader_id: 'user-manager-1',
    created_at: '2026-09-22T10:00:00Z',
    members: [
      {
        id: 'tm-1',
        team_id: 'team-bug-slayers',
        user_id: 'user-manager-1',
        user: INITIAL_PROFILES[1],
        role: 'leader',
        joined_at: '2026-09-22T10:00:00Z'
      },
      {
        id: 'tm-2',
        team_id: 'team-bug-slayers',
        user_id: 'user-srm-student',
        user: INITIAL_PROFILES[3],
        role: 'member',
        joined_at: '2026-09-22T11:30:00Z'
      }
    ]
  },
  {
    id: 'team-neural-nexus',
    event_id: 'event-codeforge-hackathon',
    team_name: 'NEURAL NEXUS',
    team_code: 'SK-NN821',
    leader_id: 'user-external-student',
    created_at: '2026-09-23T14:20:00Z',
    members: [
      {
        id: 'tm-3',
        team_id: 'team-neural-nexus',
        user_id: 'user-external-student',
        user: INITIAL_PROFILES[4],
        role: 'leader',
        joined_at: '2026-09-23T14:20:00Z'
      }
    ]
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-ai-aarav',
    registration_code: 'REG-SK-88219',
    event_id: 'event-ai-workshop',
    user_id: 'user-srm-student',
    registration_type: 'individual',
    status: 'confirmed',
    responses: {
      'What is your current experience level with Python & ML?': 'Intermediate (NumPy, PyTorch/TensorFlow)',
      'Will you bring a laptop with CUDA/GPU or Colab access?': 'Yes, dedicated GPU laptop'
    },
    created_at: '2026-09-21T09:15:00Z'
  },
  {
    id: 'reg-hack-harshanth',
    registration_code: 'REG-SK-90124',
    event_id: 'event-codeforge-hackathon',
    user_id: 'user-manager-1',
    registration_type: 'team',
    team_id: 'team-bug-slayers',
    status: 'confirmed',
    responses: {
      'Target Track / Domain': 'Autonomous AI & Agents',
      'GitHub or Portfolio Links of Team Members': 'https://github.com/harshanth, https://github.com/aarav',
      'Brief idea summary or problem statement you intend to tackle': 'Self-healing distributed campus logistics agent'
    },
    created_at: '2026-09-22T10:00:00Z'
  },
  {
    id: 'reg-hack-aarav',
    registration_code: 'REG-SK-90125',
    event_id: 'event-codeforge-hackathon',
    user_id: 'user-srm-student',
    registration_type: 'team',
    team_id: 'team-bug-slayers',
    status: 'confirmed',
    responses: {},
    created_at: '2026-09-22T11:30:00Z'
  },
  {
    id: 'reg-cloud-aarav',
    registration_code: 'REG-SK-77102',
    event_id: 'event-cloud-native-microservices',
    user_id: 'user-srm-student',
    registration_type: 'individual',
    status: 'confirmed',
    responses: {},
    created_at: '2026-08-28T14:00:00Z'
  }
];

export const INITIAL_PASSES: EventPass[] = [
  {
    id: 'pass-ai-aarav',
    registration_id: 'reg-ai-aarav',
    qr_token: 'SKETCH_SEC_V1:reg-ai-aarav:event-ai-workshop:user-srm-student:7fa890e',
    status: 'active',
    issued_at: '2026-09-21T09:15:00Z',
    registration: INITIAL_REGISTRATIONS[0]
  },
  {
    id: 'pass-hack-harshanth',
    registration_id: 'reg-hack-harshanth',
    qr_token: 'SKETCH_SEC_V1:reg-hack-harshanth:event-codeforge-hackathon:user-manager-1:8bc901f',
    status: 'active',
    issued_at: '2026-09-22T10:00:00Z',
    registration: INITIAL_REGISTRATIONS[1]
  },
  {
    id: 'pass-hack-aarav',
    registration_id: 'reg-hack-aarav',
    qr_token: 'SKETCH_SEC_V1:reg-hack-aarav:event-codeforge-hackathon:user-srm-student:3de412a',
    status: 'active',
    issued_at: '2026-09-22T11:30:00Z',
    registration: INITIAL_REGISTRATIONS[2]
  },
  {
    id: 'pass-cloud-aarav',
    registration_id: 'reg-cloud-aarav',
    qr_token: 'SKETCH_SEC_V1:reg-cloud-aarav:event-cloud-native-microservices:user-srm-student:901fac3',
    status: 'used',
    issued_at: '2026-08-28T14:00:00Z',
    registration: INITIAL_REGISTRATIONS[3]
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-cloud-aarav',
    event_id: 'event-cloud-native-microservices',
    registration_id: 'reg-cloud-aarav',
    user_id: 'user-srm-student',
    scanned_by: 'user-staff-1',
    scanned_by_name: 'Krishna Kumar (Staff)',
    checked_in_at: '2026-09-10T10:48:22Z',
    status: 'checked_in',
    notes: 'Verified SRM student pass'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-cloud-aarav',
    event_id: 'event-cloud-native-microservices',
    user_id: 'user-srm-student',
    registration_id: 'reg-cloud-aarav',
    certificate_number: 'SKETCH-CERT-2026-0042',
    issued_at: '2026-09-10T14:00:00Z',
    event_title: 'Foundations of Cloud Native Microservices',
    participant_name: 'Aarav Sharma',
    participant_reg: 'RA2311003010142',
    event_date: 'September 10, 2026'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    actor_id: 'user-admin-1',
    actor_name: 'M. Pragadeeshwaran',
    action: 'CREATE_EVENT',
    target_type: 'event',
    target_id: 'event-ai-workshop',
    details: { title: 'SKETCH AI Workshop: Generative Agents & Fine-Tuning' },
    created_at: '2026-09-15T10:00:00Z'
  },
  {
    id: 'audit-2',
    actor_id: 'user-admin-1',
    actor_name: 'M. Pragadeeshwaran',
    action: 'CREATE_EVENT',
    target_type: 'event',
    target_id: 'event-codeforge-hackathon',
    details: { title: 'CodeForge 2026: National 24-Hour Hackathon' },
    created_at: '2026-09-20T12:00:00Z'
  },
  {
    id: 'audit-3',
    actor_id: 'user-admin-1',
    actor_name: 'M. Pragadeeshwaran',
    action: 'ASSIGN_STAFF',
    target_type: 'role',
    target_id: 'user-staff-1',
    details: { assignedRole: 'attendance_staff', scope: 'event-cloud-native-microservices' },
    created_at: '2026-09-08T09:00:00Z'
  },
  {
    id: 'audit-4',
    actor_id: 'user-staff-1',
    actor_name: 'Krishna Kumar',
    action: 'ATTENDANCE_CHECKIN',
    target_type: 'registration',
    target_id: 'reg-cloud-aarav',
    details: { participant: 'Aarav Sharma', regNo: 'RA2311003010142' },
    created_at: '2026-09-10T10:48:22Z'
  }
];
