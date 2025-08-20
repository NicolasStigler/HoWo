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
import { downloadPdf } from '@/lib/pdf-utils';
import { format } from 'date-fns';
import { TimeEntry } from '@/types';
import { formatDuration } from '@/lib/time-utils';

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
    downloadPdf('pay-receipt-content', fileName);
  }

  const receiptMonth = periodLabel.split(' ')[0];
  const receiptPart = periodLabel.includes('1-15') ? '1/2' : '2/2';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black sm:max-w-md p-0 border-none rounded-lg">
        <div id="pay-receipt-content" className="p-6 font-mono text-sm bg-white text-black">
          <DialogHeader className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
            <DialogTitle className="text-lg font-bold">HoWo</DialogTitle>
            <DialogDescription className="text-xs text-black">Resumen - {receiptMonth} {receiptPart}</DialogDescription>
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

          <div className="border-t-2 border-dashed border-gray-400 pt-4 mt-4 text-right">
             <p className="text-lg font-bold">TOTAL: S/.{grandTotal.toFixed(2)}</p>
          </div>
                    
          <div className="border-t-2 border-dashed border-gray-400 pt-4 mt-6">
            <h3 className="text-center font-bold mb-2 uppercase">Detalle de Horas</h3>
            <div className='text-xs'>
              <div className="grid grid-cols-4 gap-2 font-bold border-b border-gray-300 pb-1 mb-1">
                <div>Fecha</div>
                <div>Modalidad</div>
                <div className='text-center'>Horario</div>
                <div className='text-right'>Duración</div>
              </div>
              {entries.map(entry => (
                <div key={entry.id} className="grid grid-cols-4 gap-2 py-1 border-b border-gray-200">
                  <div>{format(new Date(entry.date), 'dd/MM/yy')}</div>
                  <div>{entry.location}</div>
                  <div className='text-center'>{entry.timeIn}-{entry.timeOut}</div>
                  <div className='text-right'>{formatDuration({hours: Math.floor((new Date(`${entry.date.slice(0,10)}T${entry.timeOut}`).getTime() - new Date(`${entry.date.slice(0,10)}T${entry.timeIn}`).getTime()) / 3600000), minutes: Math.floor(((new Date(`${entry.date.slice(0,10)}T${entry.timeOut}`).getTime() - new Date(`${entry.date.slice(0,10)}T${entry.timeIn}`).getTime()) % 3600000) / 60000) })}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-6 text-xs text-gray-500">
            <p>Gracias por su trabajo!</p>
            <p>{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 bg-white rounded-b-lg">
          <Button onClick={handleDownload} className="w-full bg-blue-500 text-white hover:bg-blue-600">
            <Download className="mr-2 h-4 w-4" />
            Descargar desglosado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
