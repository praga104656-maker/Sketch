'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EventPass, Registration, EventItem } from '@/types';
import QRCode from 'qrcode';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  Users,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check
} from 'lucide-react';

function PassCard({
  pass,
  registration,
  event
}: {
  pass: EventPass;
  registration: Registration;
  event: EventItem;
}) {
  const { currentUser, cancelRegistration } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [cancelPrompt, setCancelPrompt] = useState(false);

  useEffect(() => {
    if (canvasRef.current && pass.qr_token) {
      QRCode.toCanvas(
        canvasRef.current,
        pass.qr_token,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#0B0F19',
            light: '#FFFFFF'
          }
        },
        (error) => {
          if (error) console.error('QR rendering error', error);
        }
      );
    }
  }, [pass.qr_token]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(pass.qr_token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const isUsed = pass.status === 'used';
  const isInvalid = pass.status === 'invalidated' || registration.status === 'cancelled';

  return (
    <div
      id={pass.id}
      className={`glass-panel rounded-3xl overflow-hidden border transition-all duration-300 ${
        isUsed
          ? 'border-emerald-500/40 bg-emerald-950/10'
          : isInvalid
          ? 'border-rose-500/40 opacity-75'
          : 'border-indigo-500/40 hover:border-indigo-500/60 shadow-xl shadow-indigo-950/30'
      }`}
    >
      {/* Top Banner / Event Title */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-indigo-950/70 p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 text-indigo-300 border border-indigo-500/30">
              SKETCH OFFICIAL PASS
            </span>
            {isUsed ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED CHECKED-IN
              </span>
            ) : isInvalid ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <XCircle className="w-3 h-3" />
                CANCELLED / INVALID
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <CheckCircle2 className="w-3 h-3" />
                ACTIVE PASS
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {event.title}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 no-print shrink-0">
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-surface-card border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyToken}
            className="p-2 rounded-xl bg-surface-card border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Copy QR Verification Token"
          >
            {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Pass Content: Left Details, Right QR Code */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Pass Details (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px]">Participant Name</span>
              <p className="text-sm font-bold text-white mt-0.5">{currentUser.full_name}</p>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Registration ID</span>
              <p className="font-mono text-sm font-bold text-indigo-400 mt-0.5">
                {registration.registration_code}
              </p>
            </div>

            <div>
              <span className="text-gray-400 block text-[11px]">Institution</span>
              <p className="font-medium text-gray-200 mt-0.5 truncate">
                {currentUser.institution}
              </p>
            </div>

            <div>
              <span className="text-gray-400 block text-[11px]">
                {currentUser.participant_type === 'srm' ? 'SRM Reg Number' : 'Participant Type'}
              </span>
              <p className="font-semibold text-gray-200 mt-0.5">
                {currentUser.srm_reg_number || 'External Student'}
              </p>
            </div>
          </div>

          {/* Team Info if Team Event */}
          {registration.registration_type === 'team' && registration.team && (
            <div className="p-3.5 rounded-xl bg-surface-card border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Team
                </span>
                <span className="font-bold text-white text-sm">
                  {registration.team.team_name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <span className="text-gray-400">Team Code:</span>
                <span className="font-mono font-bold text-indigo-400">
                  {registration.team.team_code}
                </span>
              </div>
            </div>
          )}

          {/* Event Schedule & Venue */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {event.start_time} - {event.end_time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {event.venue} {event.room ? `(${event.room})` : ''}
            </span>
          </div>

          {/* Cancellation Option */}
          {!isUsed && !isInvalid && (
            <div className="pt-2 no-print">
              {!cancelPrompt ? (
                <button
                  type="button"
                  onClick={() => setCancelPrompt(true)}
                  className="text-[11px] text-gray-500 hover:text-rose-400 transition-colors"
                >
                  Need to cancel registration?
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-2">
                  <p className="text-xs text-rose-300">
                    Are you sure you want to cancel this pass? Your slot will be freed immediately.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => cancelRegistration(registration.id)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                    >
                      Yes, Cancel Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelPrompt(false)}
                      className="px-3 py-1 rounded-lg bg-surface-card border border-white/10 text-gray-400 hover:text-white text-xs"
                    >
                      Keep Pass
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* QR Code Container (1 col) */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          <div className="mt-3 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
              Scan at Venue Gate
            </span>
            <span className="font-mono text-[9px] text-gray-500 truncate max-w-[200px] block">
              Token: {pass.qr_token.substring(0, 24)}...
            </span>
          </div>
        </div>

      </div>

      {/* Pass Footer Ticket Notch Detail */}
      <div className="bg-black/30 px-6 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
        <span>Organized by {event.organizer}</span>
        <span>Pass Issued: {new Date(pass.issued_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default function MyPassesPage() {
  const { currentUser, registrations, passes, events } = useApp();

  // Find user registrations
  const userRegs = registrations.filter(
    r => r.user_id === currentUser.id && r.status === 'confirmed'
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Ticket className="w-3.5 h-3.5" />
            Digital Event Passes
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Event Passes
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Display your secure QR pass at the event check-in gate for instant digital attendance.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold self-start sm:self-auto shadow-lg shadow-indigo-600/20"
        >
          Discover More Events
        </Link>
      </div>

      {/* Passes List */}
      {userRegs.length > 0 ? (
        <div className="space-y-6">
          {userRegs.map((reg) => {
            const pass = passes.find(p => p.registration_id === reg.id);
            const event = events.find(e => e.id === reg.event_id);
            if (!pass || !event) return null;

            return (
              <PassCard
                key={pass.id}
                pass={pass}
                registration={reg}
                event={event}
              />
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <Ticket className="w-14 h-14 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Event Passes Found</h2>
          <p className="text-xs text-gray-400">
            You have not registered for any upcoming events yet. Discover technical workshops, hackathons, and symposiums on our home feed.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
            >
              Browse Upcoming Events
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
