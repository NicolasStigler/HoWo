export interface TimeEntry {
  id: string;
  date: string; // ISO string
  location: 'Remoto' | 'Tienda';
  timeIn: string; // 'HH:MM'
  timeOut: string; // 'HH:MM'
}
