import { useState, useCallback } from "react";
import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback((props: ToastProps) => {
    // Use Sonner toast instead of basic alerts
    if (props.variant === 'destructive') {
      sonnerToast.error(`${props.title}${props.description ? `: ${props.description}` : ''}`);
    } else {
      sonnerToast.success(`${props.title}${props.description ? `: ${props.description}` : ''}`);
    }

    setToasts(prev => [...prev, { ...props }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== props));
    }, 5000);
  }, []);

  return {
    toast,
    toasts
  };
}
