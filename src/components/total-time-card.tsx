'use client';
import { useState } from 'react';
import { formatTotalDuration } from '@/lib/time-utils';
import { Card, CardContent } from '@/components/ui/card';
import PayReceiptModal from './pay-receipt-modal';
import { TimeEntry } from '@/types';

interface TotalTimeCardProps {
  totalMinutes: number;
  periodLabel: string;
  entries: TimeEntry[];
}

export default function TotalTimeCard({ totalMinutes, periodLabel, entries }: TotalTimeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalDuration = formatTotalDuration(totalMinutes);
  
  return (
    <>
      <Card 
        className="bg-background rounded-2xl p-2 cursor-pointer transition-all active:shadow-[inset_5px_5px_10px_#dedcff,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1a1a1a,inset_-5px_-5px_10px_#2a2a2a] shadow-[5px_5px_10px_#dedcff,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#2a2a2a]"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground font-medium mb-2">Total para esta quincena</p>
          <p className="text-5xl font-bold text-primary-foreground/90 tracking-tighter">
            {totalDuration}
          </p>
        </CardContent>
      </Card>
      <PayReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalMinutes={totalMinutes}
        periodLabel={periodLabel}
        entries={entries}
      />
    </>
  );
}
