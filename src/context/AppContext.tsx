'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  EventItem,
  Team,
  Registration,
  EventPass,
  AttendanceRecord,
  Certificate,
  AuditLog,
  EventLifecycleStatus,
  UserRoleType
} from '@/types';
import {
  INITIAL_PROFILES,
  INITIAL_EVENTS,
  INITIAL_TEAMS,
  INITIAL_REGISTRATIONS,
  INITIAL_PASSES,
  INITIAL_ATTENDANCE,
  INITIAL_CERTIFICATES,
  INITIAL_AUDIT_LOGS
} from '@/lib/mock-data';

interface AppContextType {
  currentUser: Profile;
  setCurrentUser: (user: Profile) => void;
  switchUserRole: (role: UserRoleType) => void;
  profiles: Profile[];
  events: EventItem[];
  teams: Team[];
  registrations: Registration[];
  passes: EventPass[];
  attendance: AttendanceRecord[];
  certificates: Certificate[];
  auditLogs: AuditLog[];
  
  // Profile Actions
  updateProfile: (profile: Partial<Profile>) => void;
  toggleUserStatus: (userId: string, newStatus: 'active' | 'suspended' | 'blocked') => void;
  
  // Event Actions
  createEvent: (eventData: Omit<EventItem, 'id' | 'registered_count' | 'created_by' | 'created_at'>) => EventItem;
  updateEvent: (eventId: string, partial: Partial<EventItem>) => void;
  updateEventStatus: (eventId: string, status: EventLifecycleStatus) => void;
  archiveEvent: (eventId: string) => void;
  
  // Registration Actions
  registerIndividual: (
    eventId: string,
    responses: Record<string, string>
  ) => { success: boolean; error?: string; pass?: EventPass; registration?: Registration };
  
  createTeamRegistration: (
    eventId: string,
    teamName: string,
    responses: Record<string, string>
  ) => { success: boolean; error?: string; team?: Team; pass?: EventPass; registration?: Registration };
  
  joinTeamRegistration: (
    eventId: string,
    teamCode: string
  ) => { success: boolean; error?: string; team?: Team; pass?: EventPass; registration?: Registration };
  
  cancelRegistration: (registrationId: string) => { success: boolean; error?: string };
  
  // Attendance & Check-In Actions
  scanAndCheckIn: (
    qrToken: string,
    targetEventId?: string
  ) => {
    success: boolean;
    error?: string;
    duplicate?: boolean;
    alreadyCheckedInAt?: string;
    record?: AttendanceRecord;
    participant?: Profile;
    event?: EventItem;
  };

  manualCheckIn: (
    registrationId: string,
    notes?: string
  ) => { success: boolean; error?: string; record?: AttendanceRecord };
  
  resetPlatformData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sketch_event_platform_storage_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUserState] = useState<Profile>(INITIAL_PROFILES[0]);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [passes, setPasses] = useState<EventPass[]>(INITIAL_PASSES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Initialize from LocalStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profiles) setProfiles(parsed.profiles);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.registrations) setRegistrations(parsed.registrations);
        if (parsed.passes) setPasses(parsed.passes);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.certificates) setCertificates(parsed.certificates);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.currentUserId) {
          const user = parsed.profiles?.find((p: Profile) => p.id === parsed.currentUserId) || INITIAL_PROFILES[0];
          setCurrentUserState(user);
        }
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      const state = {
        profiles,
        events,
        teams,
        registrations,
        passes,
        attendance,
        certificates,
        auditLogs,
        currentUserId: currentUser.id
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }, [isClient, profiles, events, teams, registrations, passes, attendance, certificates, auditLogs, currentUser]);

  const addAuditLog = (action: string, targetType: string, targetId: string, details?: any) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const setCurrentUser = (user: Profile) => {
    setCurrentUserState(user);
  };

  const switchUserRole = (role: UserRoleType) => {
    const target = profiles.find(p => p.role === role);
    if (target) {
      setCurrentUserState(target);
    } else {
      // create temporary profile if not found
      const fallback = profiles[0];
      setCurrentUserState({ ...fallback, role });
    }
  };

  const updateProfile = (partial: Partial<Profile>) => {
    const updated = { ...currentUser, ...partial };
    setCurrentUserState(updated);
    setProfiles(prev => prev.map(p => (p.id === currentUser.id ? updated : p)));
    addAuditLog('UPDATE_PROFILE', 'profile', currentUser.id, partial);
  };

  const toggleUserStatus = (userId: string, newStatus: 'active' | 'suspended' | 'blocked') => {
    setProfiles(prev =>
      prev.map(p => (p.id === userId ? { ...p, account_status: newStatus } : p))
    );
    if (currentUser.id === userId) {
      setCurrentUserState(prev => ({ ...prev, account_status: newStatus }));
    }
    addAuditLog('CHANGE_USER_STATUS', 'profile', userId, { newStatus });
  };

  const createEvent = (
    eventData: Omit<EventItem, 'id' | 'registered_count' | 'created_by' | 'created_at'>
  ): EventItem => {
    const id = `event-${Date.now()}`;
    const newEvent: EventItem = {
      ...eventData,
      id,
      registered_count: 0,
      created_by: currentUser.id,
      created_at: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
    addAuditLog('CREATE_EVENT', 'event', id, { title: newEvent.title, category: newEvent.category });
    return newEvent;
  };

  const updateEvent = (eventId: string, partial: Partial<EventItem>) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, ...partial } : e))
    );
    addAuditLog('UPDATE_EVENT', 'event', eventId, partial);
  };

  const updateEventStatus = (eventId: string, status: EventLifecycleStatus) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, lifecycle_status: status } : e))
    );
    addAuditLog('CHANGE_EVENT_STATUS', 'event', eventId, { status });
  };

  const archiveEvent = (eventId: string) => {
    updateEventStatus(eventId, 'archived');
  };

  // Helper validation checks
  const checkCanRegister = (event: EventItem, user: Profile) => {
    if (user.account_status === 'blocked' || user.account_status === 'suspended') {
      return { ok: false, error: 'Your account is suspended or blocked. Please contact SKETCH administrators.' };
    }
    if (event.lifecycle_status === 'registration_closed' || event.lifecycle_status === 'completed' || event.lifecycle_status === 'archived') {
      return { ok: false, error: 'Registration Closed: The registration period for this event has ended.' };
    }
    if (new Date(event.reg_close_date) < new Date()) {
      return { ok: false, error: `Registration Closed: The deadline (${new Date(event.reg_close_date).toLocaleString()}) has passed.` };
    }
    if (event.registered_count >= event.capacity) {
      return { ok: false, error: `Registration Full: This event has reached its maximum capacity of ${event.capacity}.` };
    }
    if (event.eligibility === 'srm_only' && user.participant_type !== 'srm') {
      return { ok: false, error: 'Eligibility Restriction: This event is exclusively open to SRM students.' };
    }
    // Check if already registered
    const existing = registrations.find(r => r.event_id === event.id && r.user_id === user.id && r.status === 'confirmed');
    if (existing) {
      return { ok: false, error: 'Duplicate Registration: You already have a confirmed registration for this event.' };
    }
    return { ok: true };
  };

  const registerIndividual = (
    eventId: string,
    responses: Record<string, string>
  ) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found.' };

    const validation = checkCanRegister(event, currentUser);
    if (!validation.ok) return { success: false, error: validation.error };

    const regId = `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const regCode = `REG-SK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReg: Registration = {
      id: regId,
      registration_code: regCode,
      event_id: eventId,
      user_id: currentUser.id,
      registration_type: 'individual',
      status: 'confirmed',
      responses,
      created_at: new Date().toISOString(),
      event,
      user: currentUser
    };

    const passId = `pass-${Date.now()}`;
    const qrToken = `SKETCH_SEC_V1:${regId}:${eventId}:${currentUser.id}:${Math.random().toString(36).substring(2, 9)}`;
    const newPass: EventPass = {
      id: passId,
      registration_id: regId,
      qr_token: qrToken,
      status: 'active',
      issued_at: new Date().toISOString(),
      registration: newReg
    };

    setRegistrations(prev => [newReg, ...prev]);
    setPasses(prev => [newPass, ...prev]);
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, registered_count: e.registered_count + 1 } : e))
    );

    addAuditLog('REGISTER_INDIVIDUAL', 'registration', regId, {
      eventTitle: event.title,
      regCode,
      participant: currentUser.full_name
    });

    return { success: true, pass: newPass, registration: newReg };
  };

  const createTeamRegistration = (
    eventId: string,
    teamName: string,
    responses: Record<string, string>
  ) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found.' };

    const validation = checkCanRegister(event, currentUser);
    if (!validation.ok) return { success: false, error: validation.error };

    if (!teamName || teamName.trim().length < 3) {
      return { success: false, error: 'Team name must be at least 3 characters long.' };
    }

    const teamId = `team-${Date.now()}`;
    const teamCode = `SK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newTeam: Team = {
      id: teamId,
      event_id: eventId,
      team_name: teamName.trim(),
      team_code: teamCode,
      leader_id: currentUser.id,
      created_at: new Date().toISOString(),
      members: [
        {
          id: `tm-${Date.now()}-1`,
          team_id: teamId,
          user_id: currentUser.id,
          user: currentUser,
          role: 'leader',
          joined_at: new Date().toISOString()
        }
      ]
    };

    const regId = `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const regCode = `REG-SK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReg: Registration = {
      id: regId,
      registration_code: regCode,
      event_id: eventId,
      user_id: currentUser.id,
      registration_type: 'team',
      team_id: teamId,
      team: newTeam,
      status: 'confirmed',
      responses,
      created_at: new Date().toISOString(),
      event,
      user: currentUser
    };

    const passId = `pass-${Date.now()}`;
    const qrToken = `SKETCH_SEC_V1:${regId}:${eventId}:${currentUser.id}:${Math.random().toString(36).substring(2, 9)}`;
    const newPass: EventPass = {
      id: passId,
      registration_id: regId,
      qr_token: qrToken,
      status: 'active',
      issued_at: new Date().toISOString(),
      registration: newReg
    };

    setTeams(prev => [newTeam, ...prev]);
    setRegistrations(prev => [newReg, ...prev]);
    setPasses(prev => [newPass, ...prev]);
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, registered_count: e.registered_count + 1 } : e))
    );

    addAuditLog('CREATE_TEAM', 'team', teamId, {
      teamName: newTeam.team_name,
      teamCode,
      leader: currentUser.full_name,
      eventTitle: event.title
    });

    return { success: true, team: newTeam, pass: newPass, registration: newReg };
  };

  const joinTeamRegistration = (eventId: string, teamCode: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found.' };

    const validation = checkCanRegister(event, currentUser);
    if (!validation.ok) return { success: false, error: validation.error };

    const cleanCode = teamCode.trim().toUpperCase();
    const team = teams.find(t => t.event_id === eventId && t.team_code.toUpperCase() === cleanCode);
    if (!team) {
      return { success: false, error: 'No team found with this team code. Please check the code and try again.' };
    }

    if (team.members.length >= event.max_team_size) {
      return {
        success: false,
        error: `Team Full: This team already has ${team.members.length}/${event.max_team_size} members.`
      };
    }

    if (team.members.some(m => m.user_id === currentUser.id)) {
      return { success: false, error: 'You are already a member of this team.' };
    }

    // Check institution rule
    if (event.team_institution_rule === 'same_institution') {
      const leaderMember = team.members.find(m => m.role === 'leader');
      if (leaderMember && leaderMember.user.institution !== currentUser.institution) {
        return {
          success: false,
          error: `Institution Rule Violation: This event requires all team members to be from the same institution (${leaderMember.user.institution}).`
        };
      }
    }

    const newMember = {
      id: `tm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      team_id: team.id,
      user_id: currentUser.id,
      user: currentUser,
      role: 'member' as const,
      joined_at: new Date().toISOString()
    };

    const updatedTeam = {
      ...team,
      members: [...team.members, newMember]
    };

    const regId = `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const regCode = `REG-SK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReg: Registration = {
      id: regId,
      registration_code: regCode,
      event_id: eventId,
      user_id: currentUser.id,
      registration_type: 'team',
      team_id: team.id,
      team: updatedTeam,
      status: 'confirmed',
      responses: {},
      created_at: new Date().toISOString(),
      event,
      user: currentUser
    };

    const passId = `pass-${Date.now()}`;
    const qrToken = `SKETCH_SEC_V1:${regId}:${eventId}:${currentUser.id}:${Math.random().toString(36).substring(2, 9)}`;
    const newPass: EventPass = {
      id: passId,
      registration_id: regId,
      qr_token: qrToken,
      status: 'active',
      issued_at: new Date().toISOString(),
      registration: newReg
    };

    setTeams(prev => prev.map(t => (t.id === team.id ? updatedTeam : t)));
    setRegistrations(prev => [newReg, ...prev]);
    setPasses(prev => [newPass, ...prev]);

    addAuditLog('JOIN_TEAM', 'team', team.id, {
      teamName: team.team_name,
      joinedMember: currentUser.full_name,
      eventTitle: event.title
    });

    return { success: true, team: updatedTeam, pass: newPass, registration: newReg };
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, error: 'Registration record not found.' };

    setRegistrations(prev =>
      prev.map(r => (r.id === registrationId ? { ...r, status: 'cancelled' } : r))
    );
    setPasses(prev =>
      prev.map(p => (p.registration_id === registrationId ? { ...p, status: 'invalidated' } : p))
    );
    setEvents(prev =>
      prev.map(e =>
        e.id === reg.event_id && e.registered_count > 0
          ? { ...e, registered_count: e.registered_count - 1 }
          : e
      )
    );

    addAuditLog('CANCEL_REGISTRATION', 'registration', registrationId, {
      registrationCode: reg.registration_code,
      cancelledBy: currentUser.full_name
    });

    return { success: true };
  };

  // QR Attendance Check-In with Duplicate Protection
  const scanAndCheckIn = (qrToken: string, targetEventId?: string) => {
    const cleanToken = qrToken.trim();
    const pass = passes.find(p => p.qr_token === cleanToken);

    if (!pass) {
      return {
        success: false,
        error: 'INVALID EVENT PASS: The scanned QR code is unrecognized or forged.'
      };
    }

    const reg = registrations.find(r => r.id === pass.registration_id);
    if (!reg || reg.status !== 'confirmed') {
      return {
        success: false,
        error: 'NOT REGISTERED: This registration is either cancelled or not confirmed.'
      };
    }

    if (targetEventId && reg.event_id !== targetEventId) {
      const targetEvent = events.find(e => e.id === targetEventId);
      const passEvent = events.find(e => e.id === reg.event_id);
      return {
        success: false,
        error: `WRONG EVENT PASS: This pass is for "${passEvent?.title || 'Another Event'}", but you are checking in for "${targetEvent?.title || 'Selected Event'}".`
      };
    }

    const event = events.find(e => e.id === reg.event_id);
    const participant = profiles.find(p => p.id === reg.user_id);

    if (!participant || participant.account_status === 'blocked') {
      return {
        success: false,
        error: 'BLOCKED PARTICIPANT: Participant account is suspended or blocked.'
      };
    }

    // DUPLICATE CHECK-IN DETECTION
    const existingCheckIn = attendance.find(
      a => a.registration_id === reg.id || (a.event_id === reg.event_id && a.user_id === reg.user_id)
    );

    if (existingCheckIn) {
      const timeStr = new Date(existingCheckIn.checked_in_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      return {
        success: false,
        duplicate: true,
        alreadyCheckedInAt: timeStr,
        record: existingCheckIn,
        participant,
        event,
        error: `ALREADY CHECKED IN: ${participant.full_name} was already verified and checked in at ${timeStr}.`
      };
    }

    // Success check-in!
    const attId = `att-${Date.now()}`;
    const checkInTime = new Date().toISOString();
    const newRecord: AttendanceRecord = {
      id: attId,
      event_id: reg.event_id,
      registration_id: reg.id,
      user_id: reg.user_id,
      scanned_by: currentUser.id,
      scanned_by_name: currentUser.full_name,
      checked_in_at: checkInTime,
      status: 'checked_in',
      notes: 'Digital QR scan verification'
    };

    setAttendance(prev => [newRecord, ...prev]);
    setPasses(prev =>
      prev.map(p => (p.id === pass.id ? { ...p, status: 'used' } : p))
    );

    // Auto-generate verifiable certificate if enabled
    if (event?.certificate_enabled) {
      const certId = `cert-${Date.now()}`;
      const certNo = `SKETCH-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCert: Certificate = {
        id: certId,
        event_id: reg.event_id,
        user_id: reg.user_id,
        registration_id: reg.id,
        certificate_number: certNo,
        issued_at: checkInTime,
        event_title: event.title,
        participant_name: participant.full_name,
        participant_reg: participant.srm_reg_number,
        event_date: new Date(event.event_date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      };
      setCertificates(prev => [newCert, ...prev]);
    }

    addAuditLog('ATTENDANCE_CHECKIN', 'attendance', attId, {
      participant: participant.full_name,
      srmReg: participant.srm_reg_number || 'External',
      eventTitle: event?.title,
      time: checkInTime
    });

    return {
      success: true,
      record: newRecord,
      participant,
      event
    };
  };

  const manualCheckIn = (registrationId: string, notes?: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, error: 'Registration not found' };

    const participant = profiles.find(p => p.id === reg.user_id);
    const event = events.find(e => e.id === reg.event_id);

    const existingCheckIn = attendance.find(a => a.registration_id === reg.id);
    if (existingCheckIn) {
      return { success: false, error: 'Participant has already been checked in.' };
    }

    const attId = `att-${Date.now()}`;
    const checkInTime = new Date().toISOString();
    const newRecord: AttendanceRecord = {
      id: attId,
      event_id: reg.event_id,
      registration_id: reg.id,
      user_id: reg.user_id,
      scanned_by: currentUser.id,
      scanned_by_name: currentUser.full_name,
      checked_in_at: checkInTime,
      status: 'manual_override',
      notes: notes || 'Admin manual override check-in'
    };

    setAttendance(prev => [newRecord, ...prev]);

    if (event?.certificate_enabled && participant) {
      const certId = `cert-${Date.now()}`;
      const certNo = `SKETCH-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCert: Certificate = {
        id: certId,
        event_id: reg.event_id,
        user_id: reg.user_id,
        registration_id: reg.id,
        certificate_number: certNo,
        issued_at: checkInTime,
        event_title: event.title,
        participant_name: participant.full_name,
        participant_reg: participant.srm_reg_number,
        event_date: new Date(event.event_date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      };
      setCertificates(prev => [newCert, ...prev]);
    }

    addAuditLog('MANUAL_CHECKIN', 'attendance', attId, {
      participant: participant?.full_name,
      registrationId,
      notes
    });

    return { success: true, record: newRecord };
  };

  const resetPlatformData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfiles(INITIAL_PROFILES);
    setEvents(INITIAL_EVENTS);
    setTeams(INITIAL_TEAMS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setPasses(INITIAL_PASSES);
    setAttendance(INITIAL_ATTENDANCE);
    setCertificates(INITIAL_CERTIFICATES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUserState(INITIAL_PROFILES[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        profiles,
        events,
        teams,
        registrations,
        passes,
        attendance,
        certificates,
        auditLogs,
        updateProfile,
        toggleUserStatus,
        createEvent,
        updateEvent,
        updateEventStatus,
        archiveEvent,
        registerIndividual,
        createTeamRegistration,
        joinTeamRegistration,
        cancelRegistration,
        scanAndCheckIn,
        manualCheckIn,
        resetPlatformData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
