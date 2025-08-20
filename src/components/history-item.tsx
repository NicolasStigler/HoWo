'use client';
import { useState } from 'react';
import { TimeEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateDuration, formatDuration } from '@/lib/time-utils';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import ConfirmationModal from './confirmation-modal';

interface HistoryItemProps {
  entry: TimeEntry;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ entry, onDelete }: HistoryItemProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const duration = calculateDuration(entry.timeIn, entry.timeOut);

  return (
    <>
      <Card className="bg-background rounded-xl shadow-[3px_3px_6px_#dedcff,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1a1a1a,-3px_-3px_6px_#2a2a2a]">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex-grow space-y-1">
            <div className="flex items-center gap-3">
              <p className="font-bold text-lg">{format(new Date(entry.date), 'dd/MM')}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${entry.location === 'Remoto' ? 'bg-primary/20 text-primary-foreground' : 'bg-accent/50 text-accent-foreground'}`}>
                {entry.location}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{entry.timeIn} - {entry.timeOut}</p>
          </div>
          <div className="text-right flex items-center gap-4">
            <p className="font-semibold text-lg">{formatDuration(duration)}</p>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full bg-background shadow-[inset_2px_2px_4px_#dedcff,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#1a1a1a,inset_-2px_-2px_4px_#2a2a2a] text-muted-foreground hover:text-destructive hover:bg-background active:shadow-[2px_2px_4px_#dedcff,-2px_-2px_4px_#ffffff] dark:active:shadow-[2px_2px_4px_#1a1a1a,-2px_-2px_4px_#2a2a2a] transition-all"
              onClick={() => setIsConfirmOpen(true)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
            onDelete(entry.id);
            setIsConfirmOpen(false);
        }}
        title="Eliminar jornada?"
        description="Realmente desea remover esta jornada? Esta accion no se puede deshacer."
      />
    </>
  );
}
