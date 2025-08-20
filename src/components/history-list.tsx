'use client';

import { TimeEntry } from '@/types';
import HistoryItem from './history-item';

interface HistoryListProps {
  entries: TimeEntry[];
  onDeleteEntry: (id: string) => void;
}

export default function HistoryList({ entries, onDeleteEntry }: HistoryListProps) {
    if (entries.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground rounded-2xl shadow-[inset_3px_3px_6px_#dedcff,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_#1a1a1a,inset_-3px_-3px_6px_#2a2a2a] bg-background">
                <p className="font-semibold">No hay jornadas para esta quincena.</p>
                <p className="text-sm">Agrega una jornada arriba para comenzar!</p>
            </div>
        )
    }
  return (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center text-primary-foreground/80">Historial</h2>
      {entries.map(entry => (
        <HistoryItem key={entry.id} entry={entry} onDelete={onDeleteEntry} />
      ))}
    </div>
  );
}
