'use client';

import { useState, useEffect, useCallback } from 'react';
import { TimeEntry } from '@/types';

const STORAGE_KEY = 'howo-entries';

export const useTimeEntries = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(STORAGE_KEY);
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Failed to load entries from localStorage', error);
    } finally {
        setLoading(false);
    }
  }, []);

  const saveEntries = useCallback((updatedEntries: TimeEntry[]) => {
    try {
      setEntries(updatedEntries);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Failed to save entries to localStorage', error);
    }
  }, []);

  const addEntry = useCallback((newEntry: Omit<TimeEntry, 'id'>) => {
    const entryWithId: TimeEntry = { ...newEntry, id: new Date().toISOString() };
    const updatedEntries = [...entries, entryWithId];
    saveEntries(updatedEntries);
  }, [entries, saveEntries]);

  const deleteEntry = useCallback((id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveEntries(updatedEntries);
  }, [entries, saveEntries]);

  return { entries, addEntry, deleteEntry, loading };
};
