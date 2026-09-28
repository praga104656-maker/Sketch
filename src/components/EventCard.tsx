import React from 'react';
import Link from 'next/link';
import { EventItem, Registration } from '@/types';
import { StatusBadge } from './StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  userRegistration?: Registration;
}

export function EventCard({ event, userRegistration }: EventCardProps) {
  const isFull = event.registered_count >= event.capacity;
  const isClosed =
    event.lifecycle_status === 'registration_closed' ||
    new Date(event.reg_close_date) < new Date();
  const isCompleted = event.lifecycle_status === 'completed';

  const percentFilled = Math.min(
    100,
    Math.round((event.registered_count / event.capacity) * 100)
  );

  return (
    <div className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col h-full group">
      {/* Event Poster / Header */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
            {event.category}
          </span>
          <StatusBadge
            status={event.lifecycle_status}
            capacity={event.capacity}
            registeredCount={event.registered_count}
          />
        </div>

        {/* Date Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-gray-200">
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {new Date(event.event_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            {event.start_time}
          </span>
        </div>
      </div>

      {/* Event Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Eligibility & Team Indicator */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 mb-2">
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              <ShieldCheck className="w-3 h-3" />
              {event.eligibility === 'srm_only'
                ? 'SRM Students Only'
                : event.eligibility === 'srm_external'
                ? 'SRM + External'
                : 'Open to All'}
            </span>
            <span className="flex items-center gap-1 text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
              <Users className="w-3 h-3" />
              {event.registration_type === 'team'
                ? `Teams (${event.min_team_size}-${event.max_team_size})`
                : 'Individual'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {event.title}
          </h3>

          {/* Venue */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Capacity Progress & Action */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Capacity</span>
            <span className="font-semibold text-gray-200">
              {event.registered_count} / {event.capacity} {event.registration_type === 'team' ? 'teams' : 'slots'}
            </span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentFilled >= 100
                  ? 'bg-rose-500'
                  : percentFilled >= 80
                  ? 'bg-amber-400'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          {/* Action Button */}
          {userRegistration ? (
            <Link
              href="/my-passes"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Registered • View Pass
            </Link>
          ) : isCompleted ? (
            <Link
              href={`/events/${event.id}`}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all border border-white/10"
            >
              View Event Summary
            </Link>
          ) : isFull ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gray-800/80 text-gray-400 border border-white/5 cursor-not-allowed"
            >
              Registration Full
            </button>
          ) : isClosed ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gray-800/80 text-gray-400 border border-white/5 cursor-not-allowed"
            >
              Registration Closed
            </button>
          ) : (
            <Link
              href={`/events/${event.id}`}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              Register Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
