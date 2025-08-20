'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, description }: ConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background rounded-2xl shadow-lg border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="shadow-[3px_3px_6px_#dedcff,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1a1a1a,-3px_-3px_6px_#2a2a2a] border-none active:shadow-[inset_3px_3px_6px_#dedcff,inset_-3px_-3px_6px_#ffffff] dark:active:shadow-[inset_3px_3px_6px_#1a1a1a,inset_-3px_-3px_6px_#2a2a2a] transition-all">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground shadow-[3px_3px_6px_#dedcff,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1a1a1a,-3px_-3px_6px_#2a2a2a] active:shadow-[inset_3px_3px_6px_#dedcff,inset_-3px_-3px_6px_#ffffff] dark:active:shadow-[inset_3px_3px_6px_#1a1a1a,inset_-3px_-3px_6px_#2a2a2a] transition-all">Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
