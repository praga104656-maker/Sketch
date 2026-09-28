'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  AlertCircle,
  Archive,
  Save,
  Check,
  UserCheck
} from 'lucide-react';

export default function EventManagerConsolePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const {
    events,
    registrations,
    teams,
    attendance,
    profiles,
    updateEvent,
    updateEventStatus,
    archiveEvent,
    manualCheckIn
  } = useApp();

  const event = events.find(e => e.id === eventId);
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'teams' | 'attendance'>('overview');

  // Edit State
  const [venue, setVenue] = useState(event?.venue || '');
  const [capacity, setCapacity] = useState(event?.capacity || 100);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Manual Check-in prompt state
  const [manualOverrideId, setManualOverrideId] = useState<string | null>(null);
  const [overrideNotes, setOverrideNotes] = useState('');

  if (!event) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <Link href="/admin" className="px-4 py-2 mt-4 inline-block rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Return to Admin
        </Link>
      </div>
    );
  }

  // Filtered records for this event
  const eventRegistrations = registrations.filter(r => r.event_id === event.id);
  const eventTeams = teams.filter(t => t.event_id === event.id);
  const eventAttendance = attendance.filter(a => a.event_id === event.id);

  const handleQuickSave = () => {
    updateEvent(event.id, {
      venue,
      capacity: Number(capacity)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleManualCheckInSubmit = (regId: string) => {
    manualCheckIn(regId, overrideNotes);
    setManualOverrideId(null);
    setOverrideNotes('');
  };

  // CSV Export for this specific event
  const exportEventRegistrationsCSV = () => {
    const headers = ['Registration Code', 'Participant Name', 'SRM Reg No', 'Email', 'Phone', 'Institution', 'Team Name', 'Status', 'Registered At'];
    const rows = eventRegistrations.map(r => {
      const u = profiles.find(p => p.id === r.user_id);
      const t = teams.find(team => team.id === r.team_id);
      return [
        `"${r.registration_code}"`,
        `"${u?.full_name || ''}"`,
        `"${u?.srm_reg_number || 'N/A'}"`,
        `"${u?.email || ''}"`,
        `"${u?.phone || ''}"`,
        `"${u?.institution || ''}"`,
        `"${t?.team_name || 'Individual'}"`,
        `"${r.status}"`,
        `"${new Date(r.created_at).toLocaleString()}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${event.slug}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportEventAttendanceCSV = () => {
    const headers = ['Attendance ID', 'Participant Name', 'SRM Reg No', 'Email', 'Checked In At', 'Scanned By', 'Status', 'Notes'];
    const rows = eventAttendance.map(a => {
      const u = profiles.find(p => p.id === a.user_id);
      return [
        `"${a.id}"`,
        `"${u?.full_name || ''}"`,
        `"${u?.srm_reg_number || 'N/A'}"`,
        `"${u?.email || ''}"`,
        `"${new Date(a.checked_in_at).toLocaleString()}"`,
        `"${a.scanned_by_name}"`,
        `"${a.status}"`,
        `"${a.notes || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${event.slug}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Hub
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                {event.category}
              </span>
              <StatusBadge
                status={event.lifecycle_status}
                capacity={event.capacity}
                registeredCount={event.registered_count}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {event.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={exportEventRegistrationsCSV}
              className="px-3 py-2 rounded-xl bg-surface-card border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Regs
            </button>
            <button
              type="button"
              onClick={exportEventAttendanceCSV}
              className="px-3 py-2 rounded-xl bg-surface-card border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              Export Attendance
            </button>
            <button
              type="button"
              onClick={() => archiveEvent(event.id)}
              className="px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/50 text-xs font-semibold text-rose-300 flex items-center gap-1.5"
              title="Archive Event (Preserves records)"
            >
              <Archive className="w-4 h-4" />
              Archive
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-gray-400">Total Registered</span>
          <div className="text-xl font-bold text-white mt-1">
            {event.registered_count} / {event.capacity}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-gray-400">Teams Formed</span>
          <div className="text-xl font-bold text-white mt-1">
            {eventTeams.length}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-gray-400">Gate Check-Ins</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {eventAttendance.length}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-gray-400">Turnout Rate</span>
          <div className="text-xl font-bold text-purple-400 mt-1">
            {event.registered_count > 0
              ? `${Math.round((eventAttendance.length / event.registered_count) * 100)}%`
              : '0%'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Lifecycle & Settings
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all ${
            activeTab === 'registrations'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Registrations ({eventRegistrations.length})
        </button>
        {event.registration_type === 'team' && (
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === 'teams'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Teams ({eventTeams.length})
          </button>
        )}
        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all ${
            activeTab === 'attendance'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Gate Check-Ins ({eventAttendance.length})
        </button>
      </div>

      {/* TAB 1: LIFECYCLE & SETTINGS */}
      {activeTab === 'overview' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Event State Transition</h2>
              <p className="text-xs text-gray-400">Controls backend registration gate and visibility.</p>
            </div>
            <select
              value={event.lifecycle_status}
              onChange={(e) => updateEventStatus(event.id, e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-surface-card border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="registration_open">Registration Open</option>
              <option value="registration_closed">Registration Closed</option>
              <option value="event_live">Event Live</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Quick Edit Fields */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Live Updates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-400">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-400">Capacity Limit</label>
                <input
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleQuickSave}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    Updated
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Adjustments
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-card border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Reg Code</th>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Institution / Reg No</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {eventRegistrations.map((reg) => {
                  const u = profiles.find(p => p.id === reg.user_id);
                  const isCheckedIn = attendance.some(a => a.registration_id === reg.id);
                  return (
                    <tr key={reg.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        {reg.registration_code}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {u?.full_name}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        <div>{u?.srm_reg_number || 'External'}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-xs">{u?.institution}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        <div>{u?.email}</div>
                        <div className="text-[10px] font-mono">{u?.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reg.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isCheckedIn ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setManualOverrideId(reg.id)}
                            className="px-2.5 py-1 rounded-lg bg-surface-card border border-white/10 hover:bg-white/10 text-[11px] font-semibold text-indigo-300"
                          >
                            Manual Check-In
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Manual check-in modal if selected */}
          {manualOverrideId && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-white/20 space-y-4">
                <h3 className="text-base font-bold text-white">Manual Override Check-In</h3>
                <p className="text-xs text-gray-300">
                  Record verified gate attendance for participant without requiring QR camera scan.
                </p>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Reason / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Phone battery died, verified physical college ID"
                    value={overrideNotes}
                    onChange={(e) => setOverrideNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setManualOverrideId(null)}
                    className="px-4 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualCheckInSubmit(manualOverrideId)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Confirm Check-In
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEAMS */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventTeams.map((team) => (
            <div key={team.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{team.team_name}</h3>
                  <div className="text-[10px] text-gray-400">
                    Leader: <span className="text-gray-200 font-semibold">{team.members.find(m => m.role === 'leader')?.user.full_name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-extrabold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                    {team.team_code}
                  </span>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {team.members.length} / {event.max_team_size} members
                  </div>
                </div>
              </div>

              {/* Members list */}
              <div className="space-y-1 pt-2 border-t border-white/5 text-xs">
                {team.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-1 text-gray-300">
                    <span>{m.user.full_name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {m.role === 'leader' ? '👑 Leader' : 'Member'} • {m.user.srm_reg_number || 'External'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-card border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">SRM Reg No / College</th>
                  <th className="py-3 px-4">Check-In Timestamp</th>
                  <th className="py-3 px-4">Verified By Staff</th>
                  <th className="py-3 px-4">Status & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {eventAttendance.map((att) => {
                  const u = profiles.find(p => p.id === att.user_id);
                  return (
                    <tr key={att.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white">
                        {u?.full_name}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        <div>{u?.srm_reg_number || 'External'}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-xs">{u?.institution}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-200">
                        {new Date(att.checked_in_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {att.scanned_by_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                          {att.status}
                        </span>
                        {att.notes && <div className="text-[10px] text-gray-400 mt-0.5">{att.notes}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
