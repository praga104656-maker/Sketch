'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  EventCategory,
  EventType,
  EventEligibility,
  RegistrationType,
  TeamInstitutionRule,
  EventQuestion
} from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  FileQuestion,
  Award
} from 'lucide-react';

export default function NewEventBuilderPage() {
  const router = useRouter();
  const { createEvent } = useApp();

  // Basic Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Workshop');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
  const [organizer, setOrganizer] = useState('SKETCH');
  const [contactEmail, setContactEmail] = useState('events@sketch.srmist.edu.in');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');

  // Schedule & Location
  const [eventDate, setEventDate] = useState('2026-10-20');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [regOpenDate, setRegOpenDate] = useState(new Date().toISOString().split('T')[0]);
  const [regCloseDate, setRegCloseDate] = useState('2026-10-19T23:59');
  const [eventType, setEventType] = useState<EventType>('physical');
  const [venue, setVenue] = useState('Tech Park 402, SRM IST');
  const [building, setBuilding] = useState('Tech Park');
  const [room, setRoom] = useState('TP-402');

  // Eligibility & Capacity
  const [eligibility, setEligibility] = useState<EventEligibility>('srm_external');
  const [registrationType, setRegistrationType] = useState<RegistrationType>('individual');
  const [capacity, setCapacity] = useState(100);
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [teamInstitutionRule, setTeamInstitutionRule] = useState<TeamInstitutionRule>('mixed');

  // Certificate & Instructions
  const [certificateEnabled, setCertificateEnabled] = useState(true);
  const [importantInstructions, setImportantInstructions] = useState('Bring your student ID card and college laptop with software pre-installed.');

  // Dynamic Questions
  const [questions, setQuestions] = useState<Omit<EventQuestion, 'id' | 'event_id'>[]>([
    {
      question_text: 'Current Experience Level or GitHub URL',
      question_type: 'short_text',
      is_required: true,
      sort_order: 1
    }
  ]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        question_text: '',
        question_type: 'short_text',
        is_required: false,
        sort_order: prev.length + 1
      }
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    setQuestions(prev =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedQuestions: EventQuestion[] = questions
      .filter(q => q.question_text.trim().length > 0)
      .map((q, idx) => ({
        ...q,
        id: `q-${Date.now()}-${idx}`,
        event_id: ''
      }));

    const newEvent = createEvent({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      poster_url: posterUrl,
      category,
      organizer,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      event_type: eventType,
      venue,
      building,
      room,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime,
      reg_open_date: new Date(regOpenDate).toISOString(),
      reg_close_date: new Date(regCloseDate).toISOString(),
      eligibility,
      registration_type: registrationType,
      capacity: Number(capacity),
      min_team_size: Number(minTeamSize),
      max_team_size: Number(maxTeamSize),
      team_institution_rule: teamInstitutionRule,
      lifecycle_status: 'published',
      certificate_enabled: certificateEnabled,
      important_instructions: importantInstructions,
      questions: formattedQuestions
    });

    router.push(`/admin/events/${newEvent.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Structured Event Builder
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Create New SKETCH Event
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Configure schedule, capacity, eligibility rules, and custom registration questionnaires.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Basic Information */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Event Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next-Gen Autonomous Agents Masterclass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Competition">Competition</option>
                <option value="Debate">Debate</option>
                <option value="Tech Talk">Tech Talk</option>
                <option value="Symposium">Symposium</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Organizer / Wing
              </label>
              <input
                type="text"
                required
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Description
              </label>
              <textarea
                rows={4}
                required
                placeholder="Provide a comprehensive outline of the event, learning objectives, and agenda..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Poster Image URL
              </label>
              <input
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Schedule & Venue */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
            2. Schedule & Venue
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Event Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Registration Deadline (Backend Enforced)
              </label>
              <input
                type="datetime-local"
                required
                value={regCloseDate}
                onChange={(e) => setRegCloseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Event Format
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="physical">Physical (On-Campus)</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Venue Name
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Room Number
              </label>
              <input
                type="text"
                placeholder="e.g. TP-402"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Eligibility & Registration Rules */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
            3. Eligibility, Capacity & Team Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Participant Eligibility
              </label>
              <select
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="srm_only">SRM Students Only</option>
                <option value="srm_external">SRM + External Students</option>
                <option value="open">Open to All</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Registration Type
              </label>
              <select
                value={registrationType}
                onChange={(e) => setRegistrationType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="individual">Individual Registration</option>
                <option value="team">Team Registration</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Maximum Capacity ({registrationType === 'team' ? 'Teams' : 'Attendees'})
              </label>
              <input
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {registrationType === 'team' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    Min Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={minTeamSize}
                    onChange={(e) => setMinTeamSize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    min={minTeamSize}
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    Institution Policy
                  </label>
                  <select
                    value={teamInstitutionRule}
                    onChange={(e) => setTeamInstitutionRule(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="mixed">Mixed Colleges Allowed</option>
                    <option value="same_institution">All Members Same College</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step 4: Dynamic Questionnaire Builder */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
                4. Dynamic Event-Specific Questions
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Add custom questionnaire fields without duplicating base profile data.
              </p>
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-surface-card border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                <div className="flex-1 w-full space-y-1">
                  <input
                    type="text"
                    required
                    placeholder="Question label (e.g. GitHub Repository URL or T-Shirt Size)"
                    value={q.question_text}
                    onChange={(e) => updateQuestion(idx, 'question_text', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="w-full sm:w-40">
                  <select
                    value={q.question_type}
                    onChange={(e) => updateQuestion(idx, 'question_type', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="short_text">Short Text</option>
                    <option value="long_text">Paragraph Text</option>
                    <option value="dropdown">Dropdown</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-gray-300 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={q.is_required}
                    onChange={(e) => updateQuestion(idx, 'is_required', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Required</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeQuestion(idx)}
                  className="p-2 text-gray-500 hover:text-rose-400 transition-colors shrink-0"
                  title="Remove Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 5: Certificates & Instructions */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
            5. Certificates & Final Directives
          </h2>

          <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
            <input
              type="checkbox"
              checked={certificateEnabled}
              onChange={(e) => setCertificateEnabled(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Enable Automated Certificate Generation for Verified Attendees</span>
          </label>

          <div className="space-y-1 pt-2">
            <label className="block text-xs font-medium text-gray-300">
              Important Instructions for Attendees
            </label>
            <textarea
              rows={3}
              value={importantInstructions}
              onChange={(e) => setImportantInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin"
            className="px-6 py-3 rounded-xl bg-surface-card border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Publish Event to SKETCH
          </button>
        </div>

      </form>

    </div>
  );
}
