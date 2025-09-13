'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { TimeEntry } from '@/types';
import { formatTotalDuration, calculateDuration } from '@/lib/time-utils';

interface PayReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMinutes: number;
  periodLabel: string;
  entries: TimeEntry[];
}

const DAY_RATE = 150; // 8 hours is considered a work day
const HOUR_RATE = 18.75; // 150 / 8
const MINUTE_RATE = 0.3125; // 18.75 / 60

export default function PayReceiptModal({ isOpen, onClose, totalMinutes, periodLabel, entries }: PayReceiptModalProps) {
  const workDays = Math.floor(totalMinutes / 480); // 8 hours * 60 minutes
  const remainingMinutesAfterDays = totalMinutes % 480;
  
  const remainingHours = Math.floor(remainingMinutesAfterDays / 60);
  const finalRemainingMinutes = remainingMinutesAfterDays % 60;
  
  const daysSubtotal = workDays * DAY_RATE;
  const hoursSubtotal = remainingHours * HOUR_RATE;
  const minutesSubtotal = finalRemainingMinutes * MINUTE_RATE;
  
  const grandTotal = daysSubtotal + hoursSubtotal + minutesSubtotal;

  const handleDownload = () => {
    const fileName = `Horas-${periodLabel.replace(/ /g, '_')}`;

    const headers = ['Fecha', 'Modalidad', 'Entrada', 'Salida', 'Duracion'];
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const csvContent = [
      headers.join(','),
      ...sortedEntries.map(entry => {
        const duration = calculateDuration(entry.timeIn, entry.timeOut);
        const durationMinutes = duration.hours * 60 + duration.minutes;
        const durationString = formatTotalDuration(durationMinutes).replace(':',':');
        
        const modalidad = entry.location === 'Office' ? 'Tienda' : 'Remoto';
        
        return [
          format(new Date(entry.date), 'dd/MM/yy'),
          modalidad,
          entry.timeIn,
          entry.timeOut,
          durationString,
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const receiptMonth = periodLabel.split(' ')[0];
  const receiptPart = periodLabel.includes('1-15') ? '1/2' : '2/2';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background text-foreground sm:max-w-md p-0 border-none rounded-lg">
        <div id="pay-receipt-content" className="p-6 text-sm">
          <DialogHeader className="text-center border-b-2 border-dashed border-border pb-4 mb-4">
            <DialogTitle className="text-lg font-bold">HoWo</DialogTitle>
            <DialogDescription className="text-xs">Resumen - {receiptMonth} {receiptPart}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Días de 8h:</span>
              <span>{workDays} días x S/.{DAY_RATE.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
               <span></span>
              <span>= S/.{daysSubtotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between mt-2">
              <span>Horas Extra:</span>
              <span>{remainingHours} hrs x S/.{HOUR_RATE.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
                <span></span>
                <span>= S/.{hoursSubtotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between mt-2">
              <span>Minutos Extra:</span>
              <span>{finalRemainingMinutes} min x S/.{MINUTE_RATE.toFixed(4)}</span>
            </div>
             <div className="flex justify-between">
                <span></span>
                <span>= S/.{minutesSubtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-border pt-4 mt-4 text-right">
             <p className="text-lg font-bold">TOTAL: S/.{grandTotal.toFixed(2)}</p>
          </div>
          
          <div className="text-center mt-6 text-xs text-muted-foreground">
            <p>Gracias por su trabajo!</p>
            <p>{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 rounded-b-lg">
          <Button onClick={handleDownload} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Descargar desglosado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
