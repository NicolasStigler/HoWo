'use client';

import { useState, useMemo } from 'react';
import { useTimeEntries } from '@/hooks/use-time-entries';
import {
  HalfMonth,
  generatePeriods,
  filterEntriesByPeriod,
  calculateTotalMinutes,
  getCurrentPeriod,
} from '@/lib/time-utils';
import TotalTimeCard from './total-time-card';
import TimeEntryForm from './time-entry-form';
import HistoryList from './history-list';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from './ui/skeleton';
import { ThemeToggle } from './theme-toggle';

export default function Howo() {
  const { entries, addEntry, deleteEntry, loading } = useTimeEntries();
  const [periods] = useState<HalfMonth[]>(generatePeriods(12));
  const [selectedPeriod, setSelectedPeriod] = useState<HalfMonth>(getCurrentPeriod());
  
  const handlePeriodChange = (value: string) => {
    const period = periods.find(p => p.value === value);
    if (period) {
        setSelectedPeriod(period);
    }
  };
  
  const filteredEntries = useMemo(
    () => filterEntriesByPeriod(entries, selectedPeriod),
    [entries, selectedPeriod]
  );
  
  const totalMinutes = useMemo(() => calculateTotalMinutes(filteredEntries), [filteredEntries]);

  if (loading) {
      return (
          <div className="w-full max-w-md mx-auto space-y-8">
              <Skeleton className="h-24 w-full rounded-2xl bg-muted" />
              <Skeleton className="h-64 w-full rounded-2xl bg-muted" />
              <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-2xl bg-muted" />
                  <Skeleton className="h-20 w-full rounded-2xl bg-muted" />
                  <Skeleton className="h-20 w-full rounded-2xl bg-muted" />
              </div>
          </div>
      )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <header className="text-center space-y-4">
        <div className="flex justify-between items-center">
            <div className="w-10"></div>
            <h1 className="text-4xl font-bold text-primary-foreground/80">HoWo</h1>
            <ThemeToggle />
        </div>
        <Select onValueChange={handlePeriodChange} defaultValue={selectedPeriod.value}>
          <SelectTrigger className="w-full text-lg font-semibold bg-background border-0 shadow-[5px_5px_10px_#dedcff,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#2a2a2a] focus:ring-primary h-12 rounded-xl">
            <SelectValue placeholder="Selecciona una quincena" />
          </SelectTrigger>
          <SelectContent className="bg-background shadow-lg border-none">
            {periods.map(period => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <TotalTimeCard totalMinutes={totalMinutes} periodLabel={selectedPeriod.label} entries={filteredEntries} />

      <TimeEntryForm onAddEntry={addEntry} />
      
      <HistoryList entries={filteredEntries} onDeleteEntry={deleteEntry} />
    </div>
  );
}
