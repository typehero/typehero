'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { useToast } from './use-toast';
import { CheckCircle2, AlertTriangle, InfoIcon } from 'lucide-react';

const ICONS = {
  default: <InfoIcon fill="#8B5CF6" color="#fff" size={32} />,
  success: <CheckCircle2 fill="#16A34A" color="#fff" size={32} />,
  destructive: <AlertTriangle fill="#DC1C1C" color="#fff" size={32} />,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const Icon = variant ? ICONS[variant] : null;

        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="z-10">
              {Icon && (
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-white bg-white shadow-[inset_3px_2px_2px_rgba(0,0,0,0.06)]">
                  {Icon}
                </div>
              )}
            </div>
            <div className="grid gap-1">
              {title ? <ToastTitle>{title}</ToastTitle> : null}
              {description ? <ToastDescription>{description}</ToastDescription> : null}
            </div>
            <div className="ml-auto inline-flex">{action ? action : <ToastClose />}</div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
