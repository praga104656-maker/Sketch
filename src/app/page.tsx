'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EventCard } from '@/components/EventCard';
import { EventCategory } from '@/types';
import {
  Search,
  Filter,
  Ticket,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Workshop',
  'Hackathon',
  'Competition',
  'Debate',
  'Tech Talk'
];

export default function HomePage() {
  const { events, currentUser, registrations, passes } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'srm_only' | 'open'>('all');

  // Filter registrations for current user
  const userConfirmedRegs = registrations.filter(
    r => r.user_id === currentUser.id && r.status === 'confirmed'
  );

  // Find upcoming registered events
  const registeredEventIds = new Set(userConfirmedRegs.map(r => r.event_id));
  const upcomingRegisteredEvents = events.filter(
    e => registeredEventIds.has(e.id) && e.lifecycle_status !== 'completed' && e.lifecycle_status !== 'archived'
  );

  // Filter discovery events
  const filteredEvents = events.filter(event => {
    if (event.lifecycle_status === 'archived' || event.lifecycle_status === 'draft') return false;
    
    // Category match
    if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;

    // Eligibility filter
    if (eligibilityFilter === 'srm_only' && event.eligibility !== 'srm_only') return false;
    if (eligibilityFilter === 'open' && event.eligibility === 'srm_only') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = event.title.toLowerCase().includes(q);
      const matchDesc = event.description.toLowerCase().includes(q);
      const matchVenue = event.venue.toLowerCase().includes(q);
      const matchCat = event.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchVenue && !matchCat) return false;
    }

    return true;
  });

  return (
    <div className="space-y-10">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 glass-panel border border-white/10 bg-gradient-to-br from-indigo-950/40 via-surface-card to-purple-950/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Official SKETCH Event Management Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover. Register. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Check in with digital QR passes.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Welcome, <span className="font-semibold text-white">{currentUser.full_name}</span>. Explore official technical workshops, national hackathons, design sprints, and symposiums by SKETCH.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#upcoming-events"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              Browse Events
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/my-passes"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Ticket className="w-4 h-4 text-indigo-400" />
              View My Passes ({userConfirmedRegs.length})
            </Link>
          </div>
        </div>

        {/* Decorative ambient glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* SECTION 8: YOUR UPCOMING REGISTERED EVENTS (Conditional) */}
      {upcomingRegisteredEvents.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 rounded-full bg-emerald-500"></div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Your Upcoming Registered Events
              </h2>
            </div>
            <Link
              href="/my-passes"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              All Passes ({userConfirmedRegs.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingRegisteredEvents.map(event => {
              const reg = userConfirmedRegs.find(r => r.event_id === event.id);
              const pass = passes.find(p => p.registration_id === reg?.id);
              return (
                <div
                  key={event.id}
                  className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Registered ✓
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {reg?.registration_code}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {event.start_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/my-passes#${pass?.id || ''}`}
                    className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    View Event Pass
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 8: UPCOMING EVENTS DISCOVERY */}
      <section id="upcoming-events" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Browse workshops, hackathons, and competitions. Register before capacity fills.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event, venue, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Filters: Category pills + Eligibility filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-surface-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-surface-card border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/60"
            >
              <option value="all">All Audiences</option>
              <option value="srm_only">SRM Students Only</option>
              <option value="open">SRM + External</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const reg = userConfirmedRegs.find(r => r.event_id === event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  userRegistration={reg}
                />
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No events match your criteria</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Try adjusting your search query or category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setEligibilityFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-surface-card border border-white/10 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
