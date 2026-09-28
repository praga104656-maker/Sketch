'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Users,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Ticket,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const {
    events,
    currentUser,
    teams,
    registrations,
    registerIndividual,
    createTeamRegistration,
    joinTeamRegistration
  } = useApp();

  const event = events.find(e => e.id === eventId);

  // Form states
  const [teamChoice, setTeamChoice] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [teamCodeInput, setTeamCodeInput] = useState('');
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<{
    passId: string;
    regCode: string;
    teamCode?: string;
    teamName?: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!event) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <Link href="/" className="px-4 py-2 mt-4 inline-block rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Return to Events
        </Link>
      </div>
    );
  }

  // Check if already registered
  const existingReg = registrations.find(
    r => r.event_id === event.id && r.user_id === currentUser.id && r.status === 'confirmed'
  );

  if (existingReg) {
    return (
      <div className="glass-panel rounded-2xl p-8 max-w-lg mx-auto text-center space-y-4 my-10">
        <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Already Registered</h2>
        <p className="text-xs text-gray-300">
          You already have an active registration for <span className="font-semibold text-white">{event.title}</span>.
        </p>
        <div className="p-3 bg-surface-card border border-white/10 rounded-xl font-mono text-sm text-indigo-400">
          {existingReg.registration_code}
        </div>
        <div className="pt-2">
          <Link
            href="/my-passes"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            View My Event Pass
          </Link>
        </div>
      </div>
    );
  }

  const handleDynamicChange = (questionText: string, value: string) => {
    setDynamicAnswers(prev => ({ ...prev, [questionText]: value }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    // Validate required questions
    if (event.questions) {
      for (const q of event.questions) {
        if (q.is_required && !dynamicAnswers[q.question_text]?.trim()) {
          setErrorMsg(`Please answer the required question: "${q.question_text}"`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      if (event.registration_type === 'individual') {
        const result = registerIndividual(event.id, dynamicAnswers);
        if (!result.success) {
          setErrorMsg(result.error || 'Failed to complete registration.');
          setIsSubmitting(false);
          return;
        }

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setRegisteredSuccess({
          passId: result.pass!.id,
          regCode: result.registration!.registration_code
        });
      } else {
        // Team Registration
        if (teamChoice === 'create') {
          if (!teamName.trim()) {
            setErrorMsg('Please provide a team name.');
            setIsSubmitting(false);
            return;
          }

          const result = createTeamRegistration(event.id, teamName, dynamicAnswers);
          if (!result.success) {
            setErrorMsg(result.error || 'Failed to create team.');
            setIsSubmitting(false);
            return;
          }

          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });

          setRegisteredSuccess({
            passId: result.pass!.id,
            regCode: result.registration!.registration_code,
            teamCode: result.team!.team_code,
            teamName: result.team!.team_name
          });
        } else {
          // Join existing team
          if (!teamCodeInput.trim()) {
            setErrorMsg('Please enter a valid team code.');
            setIsSubmitting(false);
            return;
          }

          const result = joinTeamRegistration(event.id, teamCodeInput.trim());
          if (!result.success) {
            setErrorMsg(result.error || 'Failed to join team.');
            setIsSubmitting(false);
            return;
          }

          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });

          setRegisteredSuccess({
            passId: result.pass!.id,
            regCode: result.registration!.registration_code,
            teamCode: result.team!.team_code,
            teamName: result.team!.team_name
          });
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview target team when typing team code
  const searchedTeam =
    teamChoice === 'join' && teamCodeInput.trim()
      ? teams.find(
          t =>
            t.event_id === event.id &&
            t.team_code.toUpperCase() === teamCodeInput.trim().toUpperCase()
        )
      : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header Back Link */}
      <div>
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Details
        </Link>
      </div>

      {/* SUCCESS CONFIRMATION MODAL / VIEW */}
      {registeredSuccess ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Registration Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              You&apos;re Officially In!
            </h1>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Your registration for <span className="font-semibold text-white">{event.title}</span> has been validated and recorded.
            </p>
          </div>

          {/* Registration Code Badge */}
          <div className="p-4 rounded-2xl bg-surface-card border border-white/10 max-w-sm mx-auto">
            <div className="text-[11px] text-gray-400">Registration ID</div>
            <div className="text-lg font-mono font-bold text-white tracking-wider mt-0.5">
              {registeredSuccess.regCode}
            </div>
          </div>

          {/* If Team Created: Team Code Card */}
          {registeredSuccess.teamCode && (
            <div className="p-5 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-semibold">
                <Users className="w-4 h-4" />
                Team: {registeredSuccess.teamName}
              </div>
              <div className="text-xs text-gray-300">
                Share this unique team code with your teammates to let them join your squad:
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl font-extrabold text-white tracking-widest px-4 py-2 rounded-xl bg-surface-dark border border-indigo-500/50">
                  {registeredSuccess.teamCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(registeredSuccess.teamCode!)}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  title="Copy Team Code"
                >
                  {copiedCode ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-[11px] text-gray-400">
                Capacity: up to {event.max_team_size} members
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/my-passes"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              View Event Pass & QR Token
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface-card border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-semibold flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        /* MAIN REGISTRATION FORM */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card Header */}
          <div className="glass-panel p-6 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              SKETCH Event Registration
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {event.title}
            </h1>
            <p className="text-xs text-gray-400">
              Format: <span className="capitalize text-gray-200">{event.event_type}</span> • Venue: <span className="text-gray-200">{event.venue}</span>
            </p>
          </div>

          {/* Participant Identity Confirmation */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Participant Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-card p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-gray-400">Full Name</span>
                <p className="font-semibold text-white mt-0.5">{currentUser.full_name}</p>
              </div>
              <div>
                <span className="text-gray-400">Email Address</span>
                <p className="font-semibold text-white mt-0.5 truncate">{currentUser.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Institution</span>
                <p className="font-semibold text-white mt-0.5 truncate">{currentUser.institution}</p>
              </div>
              <div>
                <span className="text-gray-400">
                  {currentUser.participant_type === 'srm' ? 'SRM Reg Number' : 'Participant Type'}
                </span>
                <p className="font-semibold text-white mt-0.5">
                  {currentUser.srm_reg_number || 'External Student'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              Need to update your contact or department details?{' '}
              <Link href="/profile" className="text-indigo-400 hover:underline">
                Edit Profile
              </Link>
            </p>
          </div>

          {/* TEAM CONFIGURATION (If Team Event) */}
          {event.registration_type === 'team' && (
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Team Options
                </h2>
                <span className="text-xs text-indigo-400 font-semibold">
                  Team Size: {event.min_team_size}–{event.max_team_size} Members
                </span>
              </div>

              {/* Create or Join Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-card border border-white/5">
                <button
                  type="button"
                  onClick={() => setTeamChoice('create')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    teamChoice === 'create'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Create a Team (Leader)
                </button>
                <button
                  type="button"
                  onClick={() => setTeamChoice('join')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    teamChoice === 'join'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Join with Team Code
                </button>
              </div>

              {/* Create Team Form */}
              {teamChoice === 'create' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-gray-300">
                    Team Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BUG SLAYERS"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-gray-400">
                    You will become the Team Leader and receive a shareable Team Code upon confirmation.
                  </p>
                </div>
              ) : (
                /* Join Team Form */
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-gray-300">
                    Enter Team Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SK-7X4P9"
                    value={teamCodeInput}
                    onChange={(e) => setTeamCodeInput(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-card border border-white/10 text-sm font-mono uppercase text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />

                  {/* Team live lookup preview */}
                  {searchedTeam ? (
                    <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">
                          {searchedTeam.team_name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 font-mono text-[11px]">
                          {searchedTeam.members.length} / {event.max_team_size} members
                        </span>
                      </div>
                      <div className="text-gray-300">
                        Leader:{' '}
                        <span className="text-white font-medium">
                          {searchedTeam.members.find(m => m.role === 'leader')?.user.full_name}
                        </span>
                      </div>
                      {searchedTeam.members.length >= event.max_team_size && (
                        <div className="text-rose-400 font-semibold pt-1">
                          Team Full: This team already has {event.max_team_size}/{event.max_team_size} members.
                        </div>
                      )}
                    </div>
                  ) : teamCodeInput.trim().length >= 4 ? (
                    <div className="text-[11px] text-amber-400/90">
                      No matching team found yet for this event. Please double check the code.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC REGISTRATION QUESTIONS */}
          {event.questions && event.questions.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-white">Event Specific Questions</h2>
              <div className="space-y-4">
                {event.questions.map((q) => (
                  <div key={q.id} className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-300">
                      {q.question_text} {q.is_required && <span className="text-rose-400">*</span>}
                    </label>

                    {q.question_type === 'dropdown' ? (
                      <select
                        required={q.is_required}
                        value={dynamicAnswers[q.question_text] || ''}
                        onChange={(e) => handleDynamicChange(q.question_text, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">-- Select an option --</option>
                        {q.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : q.question_type === 'long_text' ? (
                      <textarea
                        required={q.is_required}
                        rows={3}
                        value={dynamicAnswers[q.question_text] || ''}
                        onChange={(e) => handleDynamicChange(q.question_text, e.target.value)}
                        placeholder="Write your response here..."
                        className="w-full px-3 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        required={q.is_required}
                        value={dynamicAnswers[q.question_text] || ''}
                        onChange={(e) => handleDynamicChange(q.question_text, e.target.value)}
                        placeholder="Your answer..."
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                'Processing Registration...'
              ) : (
                <>
                  Confirm Registration & Generate Pass
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-2.5">
              By confirming, your profile details will be attached to this event record and verifiable QR pass.
            </p>
          </div>

        </form>
      )}

    </div>
  );
}
