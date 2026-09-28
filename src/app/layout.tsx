import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SKETCH | Centralized Event Management Platform',
  description: 'Enterprise event lifecycle, QR passes, real-time attendance, and automated certificates for SKETCH SRM.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-surface-dark text-gray-100 antialiased selection:bg-indigo-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md py-8 text-xs text-gray-400 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <span className="font-semibold text-gray-200">SKETCH Platform</span>
                <span>• SRM Institute of Science & Technology</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <Link href="/" className="hover:text-white transition-colors">Discover</Link>
                <Link href="/my-passes" className="hover:text-white transition-colors">My Passes</Link>
                <Link href="/scanner" className="hover:text-emerald-400 transition-colors">QR Scanner</Link>
                <Link href="/admin" className="hover:text-purple-400 transition-colors">Admin Hub</Link>
                <span className="text-gray-600">|</span>
                <span className="text-emerald-400 font-mono">v1.0.0 Ready</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
