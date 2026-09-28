'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ShieldAlert,
  Calendar,
  Users,
  Ticket,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Settings,
  ArrowUpRight,
  UserCheck,
  UserX,
  History,
  Activity,
  Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    currentUser,
    events,
    profiles,
    registrations,
    attendance,
    auditLogs,
    updateEventStatus,
    toggleUserStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'participants' | 'audit'>('events');
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantFilter, setParticipantFilter] = useState<'all' | 'srm' | 'external' | 'blocked'>('all');

  // Operational metrics
  const totalParticipants = profiles.length;
  const activeEventsCount = events.filter(e => e.lifecycle_status !== 'archived').length;
  const totalRegistrations = registrations.filter(r => r.status === 'confirmed').length;
  const totalAttendance = attendance.length;
  const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttendance / totalRegistrations) * 100) : 0;

  // Filter participants
  const filteredParticipants = profiles.filter(p => {
    if (participantFilter === 'srm' && p.participant_type !== 'srm') return false;
    if (participantFilter === 'external' && p.participant_type !== 'external') return false;
    if (participantFilter === 'blocked' && p.account_status === 'active') return false;

    if (participantSearch.trim()) {
      const q = participantSearch.toLowerCase();
      const matchName = p.full_name.toLowerCase().includes(q);
      const matchEmail = p.email.toLowerCase().includes(q);
      const matchReg = p.srm_reg_number?.toLowerCase().includes(q);
      const matchInst = p.institution.toLowerCase().includes(q);
      return matchName || matchEmail || matchReg || matchInst;
    }
    return true;
  });

  // CSV Export Generators
  const exportRegistrationsCSV = () => {
    const headers = ['Registration Code', 'Event Title', 'Participant Name', 'Email', 'Phone', 'Institution', 'SRM Reg No', 'Type', 'Status', 'Registered At'];
    const rows = registrations.map(r => {
      const ev = events.find(e => e.id === r.event_id);
      const u = profiles.find(p => p.id === r.user_id);
      return [
        `"${r.registration_code}"`,
        `"${ev?.title || ''}"`,
        `"${u?.full_name || ''}"`,
        `"${u?.email || ''}"`,
        `"${u?.phone || ''}"`,
        `"${u?.institution || ''}"`,
        `"${u?.srm_reg_number || 'N/A'}"`,
        `"${r.registration_type}"`,
        `"${r.status}"`,
        `"${new Date(r.created_at).toLocaleString()}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sketch_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAttendanceCSV = () => {
    const headers = ['Attendance ID', 'Event Title', 'Participant Name', 'SRM Reg No', 'Institution', 'Checked-in At', 'Scanned By', 'Status'];
    const rows = attendance.map(a => {
      const ev = events.find(e => e.id === a.event_id);
      const u = profiles.find(p => p.id === a.user_id);
      return [
        `"${a.id}"`,
        `"${ev?.title || ''}"`,
        `"${u?.full_name || ''}"`,
        `"${u?.srm_reg_number || 'N/A'}"`,
        `"${u?.institution || ''}"`,
        `"${new Date(a.checked_in_at).toLocaleString()}"`,
        `"${a.scanned_by_name}"`,
        `"${a.status}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sketch_attendance_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Master Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            SKETCH Operations Command
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Logged in as <span className="font-semibold text-white">{currentUser.full_name}</span> • Platform-level governance, event lifecycle control, and audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/new"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
          <div className="relative group">
            <button
              type="button"
              className="px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              Exports
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900 border border-white/10 shadow-2xl p-1.5 hidden group-hover:block z-50">
              <button
                type="button"
                onClick={exportRegistrationsCSV}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Export Registrations CSV
              </button>
              <button
                type="button"
                onClick={exportAttendanceCSV}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
                Export Attendance CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Metrics Cards (Section 45) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Participants</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalParticipants.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">Across SRM & External</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Active Events</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {activeEventsCount}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">Scheduled & Live</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Registrations</span>
            <Ticket className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalRegistrations.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">Confirmed passes issued</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Gate Turnout</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {attendanceRate}%
          </div>
          <div className="text-[10px] text-gray-500 mt-1">{totalAttendance} verified attendees</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'events'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          All Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'participants'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Participant Governance ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          System Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: ALL EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Manage event lifecycles, assign managers, and inspect registration rosters.</span>
            <Link href="/admin/events/new" className="text-indigo-400 hover:underline font-semibold">
              + New Event Builder
            </Link>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-card/80 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Slots</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Lifecycle Action</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white max-w-xs">
                        <Link href={`/admin/events/${event.id}`} className="hover:text-indigo-400 transition-colors">
                          {event.title}
                        </Link>
                        <div className="text-[10px] text-gray-400 font-normal mt-0.5 truncate">
                          {event.venue}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                          {event.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap">
                        <div>{new Date(event.event_date).toLocaleDateString()}</div>
                        <div className="text-[10px] text-gray-500">{event.start_time}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-white">{event.registered_count}</span>
                        <span className="text-gray-500"> / {event.capacity}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          status={event.lifecycle_status}
                          capacity={event.capacity}
                          registeredCount={event.registered_count}
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={event.lifecycle_status}
                          onChange={(e) => updateEventStatus(event.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg bg-surface-card border border-white/10 text-[11px] text-gray-200 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="registration_open">Registration Open</option>
                          <option value="registration_closed">Registration Closed</option>
                          <option value="event_live">Event Live</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          Console
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARTICIPANT GOVERNANCE */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, reg no, email..."
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={participantFilter}
                onChange={(e) => setParticipantFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Participants</option>
                <option value="srm">SRM Students Only</option>
                <option value="external">External Only</option>
                <option value="blocked">Suspended / Blocked</option>
              </select>
            </div>
          </div>

          {/* Participants Table */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-card/80 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Type / Identity</th>
                    <th className="py-3 px-4">Institution</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredParticipants.map((p) => {
                    const isBlocked = p.account_status === 'blocked';
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{p.full_name}</div>
                          <div className="text-[10px] text-gray-500 capitalize">{p.role.replace('_', ' ')}</div>
                        </td>
                        <td className="py-3 px-4">
                          {p.participant_type === 'srm' ? (
                            <div>
                              <span className="font-mono font-bold text-indigo-400">{p.srm_reg_number}</span>
                              <div className="text-[10px] text-gray-400">{p.department} ({p.year})</div>
                            </div>
                          ) : (
                            <div>
                              <span className="px-2 py-0.5 rounded bg-pink-950/40 text-pink-400 border border-pink-800/40 text-[10px] font-semibold">
                                External Student
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-gray-300">
                          {p.institution}
                        </td>
                        <td className="py-3 px-4 text-gray-400 space-y-0.5">
                          <div className="text-white">{p.email}</div>
                          <div className="text-[10px] font-mono">{p.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.account_status === 'active'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                            }`}
                          >
                            {p.account_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(p.id, 'active')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-[11px] font-semibold inline-flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" />
                              Unblock
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(p.id, 'blocked')}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 text-[11px] font-semibold inline-flex items-center gap-1"
                            >
                              <UserX className="w-3 h-3" />
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS (Section 51) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-400">
            Immutable log of all administrative actions, event modifications, staff check-ins, and participant moderation.
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-card/80 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target Type</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-white font-sans">
                        {log.actor_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 capitalize">
                        {log.target_type}
                      </td>
                      <td className="py-3 px-4 text-gray-300 font-sans max-w-sm truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
