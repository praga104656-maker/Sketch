'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  History,
  CheckCircle2,
  Calendar,
  Award,
  Clock,
  MapPin,
  Ticket,
  ArrowRight
} from 'lucide-react';

export default function ParticipationPage() {
  const { currentUser, attendance, events, certificates } = useApp();

  // Filter attendance records specifically for the current user
  const userAttendance = attendance.filter(a => a.user_id === currentUser.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <History className="w-3.5 h-3.5" />
          Verified Event History
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          My Participation
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          As per SKETCH policy, participation signifies events you have physically or digitally attended with verified QR check-in, rather than merely registered for.
        </p>
      </div>

      {/* Participation List */}
      {userAttendance.length > 0 ? (
        <div className="space-y-4">
          {userAttendance.map(att => {
            const event = events.find(e => e.id === att.event_id);
            const cert = certificates.find(c => c.event_id === att.event_id && c.user_id === currentUser.id);

            return (
              <div
                key={att.id}
                className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Attended ✓
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      Verified at {new Date(att.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {event?.title || 'SKETCH Event'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {event?.event_date ? new Date(event.event_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Date verified'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {event?.venue || 'Campus Venue'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {cert && (
                    <Link
                      href={`/certificates#${cert.id}`}
                      className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      View Certificate
                    </Link>
                  )}
                  <Link
                    href={`/events/${event?.id}`}
                    className="px-3 py-2 rounded-xl bg-surface-card border border-white/10 hover:bg-white/10 text-xs font-medium text-gray-300"
                  >
                    Event Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <History className="w-14 h-14 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Attended Events Yet</h2>
          <p className="text-xs text-gray-400">
            Once you check in at the venue gate using your event pass QR code, your participation record will be confirmed here.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
            >
              Explore Events to Attend
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
