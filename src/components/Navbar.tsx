'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Ticket,
  Award,
  QrCode,
  ShieldAlert,
  User,
  ChevronDown,
  CheckCircle2,
  Menu,
  X,
  History
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, profiles, setCurrentUser } = useApp();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStaffOrAdmin = currentUser.role === 'master_admin' || currentUser.role === 'event_manager' || currentUser.role === 'attendance_staff';
  const isAdmin = currentUser.role === 'master_admin' || currentUser.role === 'event_manager';

  const navLinks = [
    { label: 'Discover', href: '/', icon: Calendar },
    { label: 'My Passes', href: '/my-passes', icon: Ticket },
    { label: 'Participation', href: '/participation', icon: History },
    { label: 'Certificates', href: '/certificates', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-surface-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-surface-dark rounded-[10px] flex items-center justify-center font-bold text-white text-lg tracking-wider">
                  S
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent">
                  SKETCH
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Events
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Attendance Staff Scanner Quick Link */}
            {isStaffOrAdmin && (
              <Link
                href="/scanner"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/scanner'
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20'
                }`}
              >
                <QrCode className="w-4 h-4" />
                QR Scanner
              </Link>
            )}

            {/* Admin Console Quick Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith('/admin')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Persona Switcher & Profile */}
          <div className="flex items-center gap-3">
            {/* Interactive Persona Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-card border border-white/10 hover:border-indigo-500/40 text-xs text-left transition-colors"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                  currentUser.role === 'master_admin' ? 'bg-purple-600' :
                  currentUser.role === 'event_manager' ? 'bg-blue-600' :
                  currentUser.role === 'attendance_staff' ? 'bg-emerald-600' :
                  currentUser.participant_type === 'srm' ? 'bg-indigo-600' : 'bg-pink-600'
                }`}>
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden lg:block leading-tight">
                  <div className="font-semibold text-gray-200 truncate max-w-[120px]">
                    {currentUser.full_name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-gray-400 capitalize">
                    {currentUser.role === 'master_admin' ? 'Master Admin' :
                     currentUser.role === 'event_manager' ? 'Event Mgr' :
                     currentUser.role === 'attendance_staff' ? 'Staff' :
                     currentUser.participant_type === 'srm' ? 'SRM Student' : 'External'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-gray-900 border border-white/10 shadow-2xl p-2 z-50">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    Switch Persona (Live Demo)
                  </div>
                  <div className="space-y-1 mt-1">
                    {profiles.map((p) => {
                      const isSelected = p.id === currentUser.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setCurrentUser(p);
                            setIsPersonaOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white">{p.full_name}</div>
                            <div className="text-[10px] text-gray-400">
                              {p.role === 'master_admin' && '👑 Master Admin'}
                              {p.role === 'event_manager' && '⚙️ Event Manager'}
                              {p.role === 'attendance_staff' && '📱 Attendance Staff'}
                              {p.role === 'participant' && (p.participant_type === 'srm' ? '🎓 SRM Student' : '🌐 External Student')}
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/10 mt-2 pt-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsPersonaOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <User className="w-3.5 h-3.5" />
                      Manage My Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-surface-card border border-white/10 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-dark/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          {isStaffOrAdmin && (
            <Link
              href="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/10"
            >
              <QrCode className="w-4 h-4" />
              QR Attendance Scanner
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-500/10"
            >
              <ShieldAlert className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5"
          >
            <User className="w-4 h-4" />
            My Profile & Verification
          </Link>
        </div>
      )}
    </header>
  );
}
