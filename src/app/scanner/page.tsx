'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  User,
  Users,
  Building,
  Calendar,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';

export default function QRScannerPage() {
  const { events, passes, currentUser, attendance, scanAndCheckIn } = useApp();

  // Active events for scanning
  const activeEvents = events.filter(
    e => e.lifecycle_status !== 'archived' && e.lifecycle_status !== 'draft'
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(
    activeEvents[0]?.id || ''
  );
  const [tokenInput, setTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'duplicate' | 'error';
    title: string;
    message: string;
    participant?: any;
    event?: any;
    time?: string;
  } | null>(null);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Filter attendance records for current event
  const currentEventAttendance = attendance.filter(
    a => a.event_id === selectedEventId
  );

  const handleScanSubmit = (tokenToScan?: string) => {
    const token = tokenToScan || tokenInput;
    if (!token.trim()) return;

    const res = scanAndCheckIn(token.trim(), selectedEventId);

    if (res.success) {
      setScanResult({
        type: 'success',
        title: 'CHECK-IN SUCCESSFUL',
        message: `Welcome, ${res.participant?.full_name}! Attendance has been recorded digitally.`,
        participant: res.participant,
        event: res.event,
        time: new Date(res.record!.checked_in_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      });
      setTokenInput('');
    } else if (res.duplicate) {
      setScanResult({
        type: 'duplicate',
        title: 'ALREADY CHECKED IN',
        message: `Participant was previously verified and checked in at ${res.alreadyCheckedInAt}.`,
        participant: res.participant,
        event: res.event,
        time: res.alreadyCheckedInAt
      });
    } else {
      setScanResult({
        type: 'error',
        title: 'INVALID PASS',
        message: res.error || 'Failed to verify pass.'
      });
    }
  };

  // Quick helper list of active passes for current event to test with 1-click
  const samplePassesForCurrentEvent = passes.filter(
    p => p.registration.event_id === selectedEventId && p.status !== 'invalidated'
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <QrCode className="w-3.5 h-3.5" />
            Gate Attendance Scanner
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            QR Event Check-In
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Logged in as: <span className="text-white font-semibold">{currentUser.full_name}</span> ({currentUser.role.replace('_', ' ').toUpperCase()})
          </p>
        </div>

        {/* Event Selector */}
        <div className="sm:w-72">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Active Event at Gate
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setScanResult(null);
            }}
            className="w-full px-3 py-2 rounded-xl bg-surface-card border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            {activeEvents.map(e => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scanner Controller (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Scan or Paste QR Verification Token
              </h2>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Gate Scanner Ready
              </span>
            </div>

            {/* Input & Scan Button */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste QR Token string (e.g. SKETCH_SEC_V1:...)"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleScanSubmit();
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-surface-card border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleScanSubmit()}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all shrink-0"
                >
                  Verify Pass
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Staff can use a handheld barcode/QR laser scanner or tap any active pass below to simulate an instant live scan.
              </p>
            </div>

            {/* Scan Result Feedback Card */}
            {scanResult && (
              <div
                className={`p-6 rounded-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
                  scanResult.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : scanResult.type === 'duplicate'
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      scanResult.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : scanResult.type === 'duplicate'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {scanResult.type === 'success' && <CheckCircle2 className="w-7 h-7" />}
                    {scanResult.type === 'duplicate' && <AlertTriangle className="w-7 h-7" />}
                    {scanResult.type === 'error' && <AlertCircle className="w-7 h-7" />}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase font-extrabold tracking-wider">
                        {scanResult.title}
                      </span>
                      {scanResult.time && (
                        <span className="text-[11px] opacity-80 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {scanResult.time}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold">{scanResult.message}</p>

                    {scanResult.participant && (
                      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="opacity-70 text-[10px] block">Participant</span>
                          <span className="font-bold text-white">
                            {scanResult.participant.full_name}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-70 text-[10px] block">Registration No.</span>
                          <span className="font-mono text-white">
                            {scanResult.participant.srm_reg_number || 'External'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Simulation / 1-Click Tester */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Active Passes for {selectedEvent?.title}
              </h3>
              <span className="text-[11px] text-gray-500">
                {samplePassesForCurrentEvent.length} passes generated
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {samplePassesForCurrentEvent.length > 0 ? (
                samplePassesForCurrentEvent.map(p => {
                  const isAlreadyCheckedIn = attendance.some(a => a.registration_id === p.registration_id);
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-surface-card border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="font-semibold text-white truncate">
                          {p.registration.user?.full_name || 'Participant'}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono truncate">
                          {p.registration.registration_code} • {p.registration.user?.srm_reg_number || 'External'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isAlreadyCheckedIn ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Attended ✓
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Unchecked
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleScanSubmit(p.qr_token)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                        >
                          Simulate Scan
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  No passes issued yet for this event. Register participants first!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Gate Stats & Live Stream (1 col) */}
        <div className="space-y-6">
          
          {/* Live Gate Stats */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Live Gate Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-card border border-white/5">
                <span className="text-[10px] text-gray-400 block">Registered</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {selectedEvent?.registered_count || 0}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-card border border-white/5">
                <span className="text-[10px] text-gray-400 block">Checked In</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">
                  {currentEventAttendance.length}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-400 pt-2 border-t border-white/5 flex items-center justify-between">
              <span>Turnout Rate:</span>
              <span className="font-semibold text-white">
                {selectedEvent?.registered_count
                  ? `${Math.round((currentEventAttendance.length / selectedEvent.registered_count) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Recent Gate Check-Ins Stream */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Recent Gate Check-Ins
            </h3>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {currentEventAttendance.length > 0 ? (
                currentEventAttendance.map(att => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-surface-card border border-white/5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {att.user?.full_name || 'Participant'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {new Date(att.checked_in_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Scanned by: {att.scanned_by_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-500">
                  No participants checked in yet today.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
