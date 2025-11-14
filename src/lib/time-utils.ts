import { TimeEntry } from '@/types';
import {
  differenceInMinutes,
  format,
  parse,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  getDate,
  getYear,
  getMonth,
  setDate,
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
  const year = getYear(date);
  const month = getMonth(date);
  const prevMonthDate = subMonths(date, 1);
  const nextMonthDate = addMonths(date, 1);
  // 1st Half-Month: 27 to 12
  const firstHalfStart = new Date(getYear(prevMonthDate), getMonth(prevMonthDate), 27);
  const firstHalfEnd = new Date(year, month, 12);
  // 2nd Half-Month: 13 to 26
  const secondHalfStart = new Date(year, month, 13);
  const secondHalfEnd = new Date(year, month, 26);
  const firstHalf: HalfMonth = {
    label: `${format(firstHalfStart, 'MMM d')} - ${format(firstHalfEnd, 'MMM d')}`,
    value: `${format(firstHalfStart, 'yyyy-MM-dd')}`,
    startDate: firstHalfStart,
    endDate: firstHalfEnd,
  };
  const secondHalf: HalfMonth = {
    label: `${format(secondHalfStart, 'MMM d')} - ${format(secondHalfEnd, 'MMM d')}`,
    value: `${format(secondHalfStart, 'yyyy-MM-dd')}`,
    startDate: secondHalfStart,
    endDate: secondHalfEnd,
  };
  return [firstHalf, secondHalf];
};

export const generatePeriods = (count = 12): HalfMonth[] => {
  const periods: HalfMonth[] = [];
  let currentDate = new Date();
  const dayOfMonth = getDate(currentDate);
  if (dayOfMonth >= 13 && dayOfMonth <= 26) {
  } else {
    if (dayOfMonth < 13) {
      currentDate = subMonths(currentDate, 1);
    }
  }
  for (let i = 0; i < count; i++) {
    const [firstHalf, secondHalf] = getHalfMonthPeriods(currentDate);
    periods.push(secondHalf);
    periods.push(firstHalf);
    currentDate = subMonths(currentDate, 1);
  }
  const uniquePeriods = Array.from(new Map(periods.map(p => [p.value, p])).values());
  uniquePeriods.sort((a,b) => b.startDate.getTime() - a.startDate.getTime());
  return uniquePeriods;
};

export const filterEntriesByPeriod = (entries: TimeEntry[], period: HalfMonth): TimeEntry[] => {
  if (!period) return [];
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
    const startDay = new Date(period.startDate.getFullYear(), period.startDate.getMonth(), period.startDate.getDate());
    const endDay = new Date(period.endDate.getFullYear(), period.endDate.getMonth(), period.endDate.getDate());
    return entryDay >= startDay && entryDay <= endDay;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const calculateTotalMinutes = (entries: TimeEntry[]): number => {
  return entries.reduce((total, entry) => {
    const { hours, minutes } = calculateDuration(entry.timeIn, entry.timeOut);
    return total + hours * 60 + minutes;
  }, 0);
};

export const getCurrentPeriod = (): HalfMonth => {
  const now = new Date();
  const dayOfMonth = getDate(now);
  if (dayOfMonth >= 13 && dayOfMonth <= 26) {
    const [, secondHalf] = getHalfMonthPeriods(now);
    return secondHalf;
  } else {
    let targetDate = now;
    if (dayOfMonth < 13) {
      targetDate = now;
    } else {
      targetDate = addMonths(now, 1);
    }
    const [firstHalf] = getHalfMonthPeriods(targetDate);
    return firstHalf;
  }
}
