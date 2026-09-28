'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ParticipantType } from '@/types';
import {
  User,
  ShieldCheck,
  Building,
  GraduationCap,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Save,
  KeyRound
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateProfile, profiles } = useApp();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [participantType, setParticipantType] = useState<ParticipantType>(currentUser.participant_type);
  const [institution, setInstitution] = useState(currentUser.institution);
  const [srmRegNumber, setSrmRegNumber] = useState(currentUser.srm_reg_number || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [year, setYear] = useState(currentUser.year || '');
  const [section, setSection] = useState(currentUser.section || '');

  // OTP Verification Simulation State
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(true);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTypeSwitch = (type: ParticipantType) => {
    setParticipantType(type);
    if (type === 'srm') {
      setInstitution('SRM Institute of Science and Technology, Kattankulathur');
    } else {
      setInstitution(institution === 'SRM Institute of Science and Technology, Kattankulathur' ? 'Anna University' : institution);
      setSrmRegNumber('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate uniqueness of SRM reg number if provided
    if (participantType === 'srm' && srmRegNumber.trim()) {
      const conflict = profiles.find(
        p => p.id !== currentUser.id && p.srm_reg_number?.toUpperCase() === srmRegNumber.trim().toUpperCase()
      );
      if (conflict) {
        setMessage({
          type: 'error',
          text: `Duplicate Identity Error: SRM Registration Number "${srmRegNumber}" is already linked to another participant account (${conflict.full_name}).`
        });
        return;
      }
    }

    updateProfile({
      full_name: fullName,
      email,
      phone,
      participant_type: participantType,
      institution,
      srm_reg_number: participantType === 'srm' ? srmRegNumber.trim().toUpperCase() : undefined,
      department,
      year,
      section: participantType === 'srm' ? section : undefined
    });

    setMessage({
      type: 'success',
      text: 'Profile details saved successfully!'
    });
  };

  const handleSimulateOTP = () => {
    setIsVerifyingPhone(true);
    setOtpCode('');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456' || otpCode.length === 6) {
      setPhoneVerified(true);
      setIsVerifyingPhone(false);
      setMessage({ type: 'success', text: 'Phone number verified via OTP ✓' });
    } else {
      setMessage({ type: 'error', text: 'Invalid OTP. For demo purposes, enter 123456.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
          <User className="w-3.5 h-3.5" />
          Participant Identity
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Profile & Academic Verification
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Your profile determines event eligibility (SRM Only vs External) and appears on all your digital passes and certificates.
        </p>
      </div>

      {/* Account Verification & Status Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-lg text-white">
            {currentUser.full_name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-white text-base flex items-center gap-2">
              {currentUser.full_name}
              {phoneVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Account Status:{' '}
              <span className="font-semibold text-emerald-400 uppercase">
                {currentUser.account_status}
              </span>
              {' '}• Role: <span className="font-mono text-indigo-300 capitalize">{currentUser.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Participant Type Switcher */}
        <div className="p-1 rounded-xl bg-surface-card border border-white/5 flex gap-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTypeSwitch('srm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              participantType === 'srm'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SRM Student
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch('external')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              participantType === 'external'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            External Participant
          </button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Personal Details Section */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Personal Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Phone Number (with OTP Verification)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleSimulateOTP}
                  className="px-4 py-2.5 rounded-xl bg-surface-card border border-white/10 hover:bg-white/10 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {phoneVerified ? 'Re-Verify OTP' : 'Verify Phone'}
                </button>
              </div>

              {/* OTP Simulation Input */}
              {isVerifyingPhone && (
                <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 animate-in fade-in">
                  <div className="text-xs text-indigo-300">
                    A 6-digit OTP was sent to <span className="font-mono font-bold text-white">{phone}</span> (Demo code: <span className="font-mono text-emerald-400">123456</span>)
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-36 px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10 text-xs font-mono text-white text-center tracking-widest focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                    >
                      Confirm OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Academic & Institution Details */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            {participantType === 'srm' ? 'SRM Academic Details' : 'Institution Details'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                College / University
              </label>
              <input
                type="text"
                required
                disabled={participantType === 'srm'}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-75"
              />
            </div>

            {participantType === 'srm' && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-300">
                  SRM Registration Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RA2311003010142"
                  value={srmRegNumber}
                  onChange={(e) => setSrmRegNumber(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs font-mono uppercase text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-gray-400">
                  Must be unique across the platform.
                </span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Department / Branch
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science and Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {participantType === 'srm' && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-300">
                  Section
                </label>
                <input
                  type="text"
                  placeholder="e.g. A, B, C"
                  value={section}
                  onChange={(e) => setSection(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-white/10 text-xs font-mono uppercase text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/60 border border-rose-800 text-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>{message.text}</div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>

      </form>

    </div>
  );
}
