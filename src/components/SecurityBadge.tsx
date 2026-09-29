import React from 'react';
import { 
  X, ShieldCheck, Lock, EyeOff, Radio, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SecurityBadge: React.FC = () => {
  const { 
    isSecurityModalOpen, 
    setIsSecurityModalOpen 
  } = useApp();

  if (!isSecurityModalOpen) return null;

  const securityFeatures = [
    {
      icon: EyeOff,
      title: 'Zero-Download Policy & Direct Link Suppression',
      desc: 'All native browser download controls, context menus, and media download hooks are strictly suppressed.'
    },
    {
      icon: Lock,
      title: 'Encrypted Stream Chunks (DRM Architecture)',
      desc: 'Videos stream via encrypted in-memory chunks without saving raw media files on the device.'
    },
    {
      icon: Radio,
      title: 'Dynamic Shifting Anti-Screen Capture Watermark',
      desc: 'A unique user identifier watermark floats dynamically over playback to deter screen recording and piracy.'
    },
    {
      icon: ShieldCheck,
      title: 'Right-Click & Shortcut Shield',
      desc: 'Keyboard shortcuts like Save As (Ctrl+S) and developer inspectors are intercepted during streaming.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsSecurityModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base sm:text-lg">
                DRM & Anti-Download Shield
              </h2>
              <p className="text-xs text-neutral-400">
                Proprietary non-downloadable secure streaming
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSecurityModalOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body list of protections */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Video-NUNS protocol active: Videos can only be streamed online and cannot be downloaded.
            </span>
          </div>

          <div className="space-y-3">
            {securityFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-100">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-center">
          <button
            onClick={() => setIsSecurityModalOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
