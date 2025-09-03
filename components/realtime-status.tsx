"use client";

import { useRealtime } from '@/components/realtime-provider';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RealtimeStatusIndicator({ className }: { className?: string }) {
  const { isConnected } = useRealtime();

  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"} 
      className={cn(
        "gap-1.5 text-xs font-medium transition-all duration-300",
        isConnected 
          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" 
          : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
        className
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          Live
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Offline
        </>
      )}
    </Badge>
  );
}
