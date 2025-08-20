import { TimeEntry } from '@/types';
import {
  differenceInMinutes,
  format,
  parse,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';

export const calculateDuration = (timeIn: string, timeOut: string): { hours: number; minutes: number } => {
  if (!timeIn || !timeOut) return { hours: 0, minutes: 0 };
  const startTime = parse(timeIn, 'HH:mm', new Date());
  const endTime = parse(timeOut, 'HH:mm', new Date());
  const diff = differenceInMinutes(endTime, startTime);
  if (diff < 0) return { hours: 0, minutes: 0 };
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return { hours, minutes };
};

export const formatDuration = (duration: { hours: number; minutes: number }): string => {
  return `${duration.hours}h ${duration.minutes}m`;
};

export const formatTotalDuration = (totalMinutes: number): string => {
  if (totalMinutes < 0) totalMinutes = 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export type HalfMonth = {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
};

export const getHalfMonthPeriods = (date: Date): [HalfMonth, HalfMonth] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const midMonth = new Date(date.getFullYear(), date.getMonth(), 15);

  const firstHalf: HalfMonth = {
    label: `${format(monthStart, 'MMMM')} (1-15)`,
    value: `${format(monthStart, 'yyyy-MM')}-1`,
    startDate: monthStart,
    endDate: midMonth,
  };

  const secondHalf: HalfMonth = {
    label: `${format(monthStart, 'MMMM')} (16-${format(monthEnd, 'd')})`,
    value: `${format(monthStart, 'yyyy-MM')}-2`,
    startDate: new Date(date.getFullYear(), date.getMonth(), 16),
    endDate: monthEnd,
  };

  return [firstHalf, secondHalf];
};

export const generatePeriods = (count = 6): HalfMonth[] => {
  const periods: HalfMonth[] = [];
  let currentDate = new Date();
  for (let i = 0; i < count; i++) {
    const [firstHalf, secondHalf] = getHalfMonthPeriods(currentDate);
    periods.push(secondHalf, firstHalf);
    currentDate = subMonths(currentDate, 1);
  }
  return periods.reverse();
};

export const filterEntriesByPeriod = (entries: TimeEntry[], period: HalfMonth): TimeEntry[] => {
    if (!period) return [];
    return entries
        .filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= period.startDate && entryDate <= period.endDate;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const calculateTotalMinutes = (entries: TimeEntry[]): number => {
  return entries.reduce((total, entry) => {
    const { hours, minutes } = calculateDuration(entry.timeIn, entry.timeOut);
    return total + hours * 60 + minutes;
  }, 0);
};

export const getCurrentPeriod = (): HalfMonth => {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const [firstHalf, secondHalf] = getHalfMonthPeriods(now);
    return dayOfMonth <= 15 ? firstHalf : secondHalf;
}
