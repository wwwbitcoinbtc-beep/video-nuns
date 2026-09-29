import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 w-full px-4 flex items-center justify-between text-[11px] font-mono font-medium text-neutral-300 bg-neutral-950/80 backdrop-blur-md select-none shrink-0 z-40 border-b border-neutral-900/40">
      <div className="flex items-center gap-1.5">
        <span>{timeStr || '12:45'}</span>
      </div>
      <div className="flex items-center gap-2 text-neutral-400">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px]">98%</span>
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
