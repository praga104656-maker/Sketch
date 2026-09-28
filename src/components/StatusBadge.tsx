import React from 'react';
import { EventLifecycleStatus } from '@/types';

interface StatusBadgeProps {
  status: EventLifecycleStatus;
  capacity?: number;
  registeredCount?: number;
}

export function StatusBadge({ status, capacity, registeredCount }: StatusBadgeProps) {
  const isFull = capacity !== undefined && registeredCount !== undefined && registeredCount >= capacity;

  if (status === 'archived') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700">
        Archived
      </span>
    );
  }

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
        Event Completed
      </span>
    );
  }

  if (status === 'event_live') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Live Now
      </span>
    );
  }

  if (status === 'registration_closed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60">
        Registration Closed
      </span>
    );
  }

  if (isFull) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
        Registration Full
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
      Registration Open
    </span>
  );
}
