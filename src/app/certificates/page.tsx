'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Certificate } from '@/types';
import {
  Award,
  Download,
  Printer,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CertificatesPage() {
  const { currentUser, certificates } = useApp();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(
    certificates.find(c => c.user_id === currentUser.id) || null
  );

  const userCertificates = certificates.filter(c => c.user_id === currentUser.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <Award className="w-3.5 h-3.5" />
            Verified Digital Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Certificates of Participation
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Certificates are automatically generated upon successful gate check-in and attendance verification.
          </p>
        </div>

        {selectedCert && (
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 self-start sm:self-auto transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Save Certificate PDF
          </button>
        )}
      </div>

      {userCertificates.length > 0 ? (
        <div className="space-y-8">
          
          {/* Certificate Selection Tabs if multiple */}
          {userCertificates.length > 1 && (
            <div className="flex flex-wrap gap-2 no-print">
              {userCertificates.map(cert => (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCert?.id === cert.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'bg-surface-card border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {cert.event_title}
                </button>
              ))}
            </div>
          )}

          {/* ACTIVE CERTIFICATE DISPLAY (PRINT-READY DESIGN) */}
          {selectedCert && (
            <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-purple-500/40 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-center relative overflow-hidden shadow-2xl">
              
              {/* Certificate Border Accents */}
              <div className="absolute inset-3 border-2 border-indigo-500/20 rounded-2xl pointer-events-none" />
              <div className="absolute inset-4 border border-purple-500/10 rounded-xl pointer-events-none" />

              {/* Watermark Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <div className="w-96 h-96 rounded-full border-8 border-white flex items-center justify-center font-black text-9xl">
                  S
                </div>
              </div>

              {/* Certificate Header */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm">
                    S
                  </div>
                  <span className="text-xl font-black tracking-widest text-white">
                    SKETCH
                  </span>
                </div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold">
                  SRM Institute of Science and Technology
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-wider pt-4">
                  CERTIFICATE OF PARTICIPATION
                </h2>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
              </div>

              {/* Certificate Recipient */}
              <div className="relative z-10 py-8 space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  This is proudly presented to
                </p>
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {selectedCert.participant_name}
                </div>
                {selectedCert.participant_reg && (
                  <p className="font-mono text-xs text-indigo-400">
                    Registration No: {selectedCert.participant_reg}
                  </p>
                )}
                <p className="text-xs text-gray-300 max-w-lg mx-auto leading-relaxed pt-2">
                  for active and verified participation in the technical event
                </p>
                <div className="text-lg sm:text-xl font-bold text-white max-w-xl mx-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  {selectedCert.event_title}
                </div>
                <p className="text-xs text-gray-400">
                  Conducted on {selectedCert.event_date}
                </p>
              </div>

              {/* Certificate Signatures & Seal */}
              <div className="relative z-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                
                {/* Left signature */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="font-serif italic text-base text-gray-300">
                    M. Pragadeeshwaran
                  </div>
                  <div className="w-32 h-0.5 bg-white/20 mx-auto sm:mx-0" />
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Master Admin, SKETCH
                  </div>
                </div>

                {/* Center Official Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400/50 bg-amber-500/10 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/80 mt-1">
                    Verified Digital Seal
                  </span>
                </div>

                {/* Right verification token */}
                <div className="text-center sm:text-right space-y-1 font-mono text-xs">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Certificate Number
                  </div>
                  <div className="font-bold text-indigo-400">
                    {selectedCert.certificate_number}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    Issued: {new Date(selectedCert.issued_at).toLocaleDateString()}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <Award className="w-14 h-14 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Certificates Issued Yet</h2>
          <p className="text-xs text-gray-400">
            Certificates are issued automatically upon gate check-in at completed SKETCH events.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
            >
              Discover Upcoming Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
