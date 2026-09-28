'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Ticket,
  FileQuestion,
  Award
} from 'lucide-react';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { events, currentUser, registrations, passes } = useApp();

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-gray-400 mt-2 mb-6">
          The event you are looking for does not exist or has been archived.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
        >
          Return to Events
        </Link>
      </div>
    );
  }

  // Check if current user is registered
  const userRegistration = registrations.find(
    r => r.event_id === event.id && r.user_id === currentUser.id && r.status === 'confirmed'
  );
  const userPass = passes.find(p => p.registration_id === userRegistration?.id);

  const isFull = event.registered_count >= event.capacity;
  const isClosed =
    event.lifecycle_status === 'registration_closed' ||
    new Date(event.reg_close_date) < new Date();
  const isCompleted = event.lifecycle_status === 'completed';

  const isSrmRestricted = event.eligibility === 'srm_only' && currentUser.participant_type !== 'srm';

  const percentFilled = Math.min(
    100,
    Math.round((event.registered_count / event.capacity) * 100)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
      </div>

      {/* Hero Poster Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 h-72 sm:h-96 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/60 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
            {event.category}
          </span>
          <StatusBadge
            status={event.lifecycle_status}
            capacity={event.capacity}
            registeredCount={event.registered_count}
          />
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              {event.eligibility === 'srm_only'
                ? 'SRM Students Only'
                : event.eligibility === 'srm_external'
                ? 'SRM + External Students'
                : 'Open to All'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 backdrop-blur-md">
              <Users className="w-3.5 h-3.5" />
              {event.registration_type === 'team'
                ? `Team Event (${event.min_team_size}-${event.max_team_size} members)`
                : 'Individual Registration'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Grid: Details Left, Registration Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Event */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h2 className="text-lg font-bold text-white">About the Event</h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Schedule & Location */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Schedule & Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-card border border-white/5">
                <Calendar className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <div className="text-gray-400">Date</div>
                  <div className="font-semibold text-white mt-0.5">
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-card border border-white/5">
                <Clock className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <div className="text-gray-400">Time</div>
                  <div className="font-semibold text-white mt-0.5">
                    {event.start_time} - {event.end_time} IST
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-card border border-white/5 sm:col-span-2">
                <MapPin className="w-4 h-4 text-rose-400 mt-0.5" />
                <div>
                  <div className="text-gray-400">Venue</div>
                  <div className="font-semibold text-white mt-0.5">
                    {event.venue}
                    {event.building && ` (${event.building})`}
                    {event.room && ` • Room ${event.room}`}
                  </div>
                  <div className="text-[11px] text-gray-500 capitalize mt-0.5">
                    Event Format: {event.event_type}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Instructions */}
          {event.important_instructions && (
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400" />
                Important Instructions
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {event.important_instructions}
              </p>
            </div>
          )}

          {/* Dynamic Registration Questions Preview */}
          {event.questions && event.questions.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-indigo-400" />
                Registration Requirements
              </h3>
              <p className="text-xs text-gray-400">
                You will be asked to provide the following event-specific details upon registering:
              </p>
              <div className="space-y-2 mt-2">
                {event.questions.map((q, idx) => (
                  <div key={q.id} className="p-2.5 rounded-lg bg-surface-card border border-white/5 text-xs text-gray-300 flex items-start gap-2">
                    <span className="font-mono text-indigo-400">{idx + 1}.</span>
                    <div>
                      <span className="font-medium text-white">{q.question_text}</span>
                      {q.is_required && <span className="text-rose-400 ml-1">*</span>}
                      <span className="text-[10px] text-gray-500 block uppercase tracking-wider mt-0.5">
                        Type: {q.question_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer & Contact Info */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Organizer Contact</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
              <span className="font-semibold text-white">{event.organizer}</span>
              {event.contact_email && (
                <a href={`mailto:${event.contact_email}`} className="flex items-center gap-1 text-indigo-400 hover:underline">
                  <Mail className="w-3.5 h-3.5" />
                  {event.contact_email}
                </a>
              )}
              {event.contact_phone && (
                <span className="flex items-center gap-1 text-gray-400">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  {event.contact_phone}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Registration Card (1 col) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 sticky top-24 space-y-5">
            <div>
              <div className="text-xs text-gray-400">Registration Status</div>
              <div className="mt-1">
                <StatusBadge
                  status={event.lifecycle_status}
                  capacity={event.capacity}
                  registeredCount={event.registered_count}
                />
              </div>
            </div>

            {/* Capacity meter */}
            <div className="space-y-1.5 pt-3 border-t border-white/10">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Slots Booked</span>
                <span className="font-semibold text-white">
                  {event.registered_count} / {event.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    percentFilled >= 100
                      ? 'bg-rose-500'
                      : percentFilled >= 80
                      ? 'bg-amber-400'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-500 text-right">
                {event.capacity - event.registered_count} remaining
              </div>
            </div>

            {/* Deadline information */}
            <div className="text-xs text-gray-400 space-y-1 pt-3 border-t border-white/10">
              <div>Deadline:</div>
              <div className="font-medium text-gray-200">
                {new Date(event.reg_close_date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Certificate badge */}
            {event.certificate_enabled && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-300">
                <Award className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Verified digital certificate provided upon QR check-in</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              {userRegistration ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">You are registered!</div>
                      <div className="text-[11px] text-emerald-400/80 mt-0.5 font-mono">
                        Code: {userRegistration.registration_code}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/my-passes#${userPass?.id || ''}`}
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    Open Your Event Pass & QR
                  </Link>
                </div>
              ) : isSrmRestricted ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-gray-800 text-gray-400 border border-white/5 cursor-not-allowed"
                  >
                    SRM Students Only
                  </button>
                  <p className="text-[11px] text-rose-400 text-center">
                    Your current profile is configured as External. Switch to an SRM profile to register.
                  </p>
                </div>
              ) : isCompleted ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-gray-800 text-gray-400 border border-white/5 cursor-not-allowed"
                >
                  Event Completed
                </button>
              ) : isFull ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-gray-800 text-gray-400 border border-white/5 cursor-not-allowed"
                  >
                    REGISTRATION FULL
                  </button>
                  <p className="text-[11px] text-amber-400/80 text-center">
                    All {event.capacity} seats have been reserved.
                  </p>
                </div>
              ) : isClosed ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-gray-800 text-gray-400 border border-white/5 cursor-not-allowed"
                  >
                    REGISTRATION CLOSED
                  </button>
                  <p className="text-[11px] text-rose-400 text-center">
                    Registration deadline has passed.
                  </p>
                </div>
              ) : (
                <Link
                  href={`/events/${event.id}/register`}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  REGISTER FOR EVENT
                </Link>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
