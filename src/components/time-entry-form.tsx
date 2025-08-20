'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TimeEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  location: z.enum(['Remoto', 'Tienda']),
  timeIn: z.string().min(1, 'Time in is required'),
  timeOut: z.string().min(1, 'Time out is required'),
});

type FormData = z.infer<typeof formSchema>;

interface TimeEntryFormProps {
  onAddEntry: (entry: Omit<TimeEntry, 'id'>) => void;
}

export default function TimeEntryForm({ onAddEntry }: TimeEntryFormProps) {
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      location: 'Tienda',
      timeIn: '',
      timeOut: '',
    },
  });

  const locationValue = watch('location');

  const onSubmit = (data: FormData) => {
    onAddEntry({
        ...data,
        date: new Date(`${data.date}T00:00:00`).toISOString(), // Store as ISO string, avoid timezone issues
    });
    reset({
      date: format(new Date(), 'yyyy-MM-dd'),
      location: 'Tienda',
      timeIn: '',
      timeOut: '',
    });
  };
  
  const neumorphicInset = 'shadow-[inset_3px_3px_6px_#dedcff,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_#1a1a1a,inset_-3px_-3px_6px_#2a2a2a]';
  const neumorphicOutset = 'shadow-[3px_3px_6px_#dedcff,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1a1a1a,-3px_-3px_6px_#2a2a2a]';
  const neumorphicOutsetActive = 'active:shadow-[inset_3px_3px_6px_#dedcff,inset_-3px_-3px_6px_#ffffff] dark:active:shadow-[inset_3px_3px_6px_#1a1a1a,inset_-3px_-3px_6px_#2a2a2a]';


  return (
    <Card className={`bg-background rounded-2xl p-2 ${neumorphicOutset}`}>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input type="date" id="date" {...field} className={`bg-background border-none rounded-lg ${neumorphicInset} focus:ring-primary`} />
                  {errors.date && <p className="text-destructive text-xs">{errors.date.message}</p>}
                </div>
              )}
            />
          </div>
          <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <div className={`flex items-center justify-between rounded-lg p-3 bg-background ${neumorphicInset}`} >
                   <Label htmlFor="location" className="font-medium">Modalidad</Label>
                   <div className="flex items-center gap-3">
                      <span className={cn("text-sm font-medium text-muted-foreground transition-colors", locationValue === 'Remoto' && 'text-primary-foreground/90')}>Remoto</span>
                          <Switch
                              id="location"
                              checked={field.value === 'Tienda'}
                              onCheckedChange={(checked) => field.onChange(checked ? 'Tienda' : 'Remoto')}
                              className="data-[state=checked]:bg-slate-300 data-[state=unchecked]:bg-slate-300"
                          />
                      <span className={cn("text-sm font-medium text-muted-foreground transition-colors", locationValue === 'Tienda' && 'text-primary-foreground/90')}>Tienda</span>
                   </div>
                </div>
              )}
          />
          <div className="grid grid-cols-2 gap-4">
             <Controller
                name="timeIn"
                control={control}
                render={({ field }) => (
                    <div className="space-y-2">
                        <Label htmlFor="timeIn">Inicio de Jornada</Label>
                        <Input type="time" id="timeIn" {...field} className={`bg-background border-none rounded-lg ${neumorphicInset} focus:ring-primary`} />
                        {errors.timeIn && <p className="text-destructive text-xs">{errors.timeIn.message}</p>}
                    </div>
                )}
            />
            <Controller
                name="timeOut"
                control={control}
                render={({ field }) => (
                    <div className="space-y-2">
                        <Label htmlFor="timeOut">Fin de Jornada</Label>
                        <Input type="time" id="timeOut" {...field} className={`bg-background border-none rounded-lg ${neumorphicInset} focus:ring-primary`} />
                        {errors.timeOut && <p className="text-destructive text-xs">{errors.timeOut.message}</p>}
                    </div>
                )}
            />
          </div>
          <Button type="submit" className={`w-full h-12 text-lg font-semibold bg-accent text-accent-foreground rounded-xl ${neumorphicOutset} hover:bg-accent/90 ${neumorphicOutsetActive} transition-all`}>
            Registrar Jornada
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
