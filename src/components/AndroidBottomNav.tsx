import React from 'react';
import { Home, Film, Wallet, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const AndroidBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    purchasedMovieIds, 
    watchlistIds 
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'library',
      label: 'My Movies',
      icon: Film,
      badge: purchasedMovieIds.length,
    },
    {
      id: 'wallet',
      label: 'Crypto Wallet',
      icon: Wallet,
    },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: Bookmark,
      badge: watchlistIds.length > 0 ? watchlistIds.length : undefined,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-30 w-full bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center relative py-1 transition-all group ${
              isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {/* Active Pill Indicator for Android Material 3 */}
            <div className={`relative px-4 py-1 rounded-full transition-all duration-200 ${
              isActive ? 'bg-amber-500/15' : 'group-hover:bg-neutral-800/40'
            }`}>
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`} />
              
              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors ${
              isActive ? 'font-bold text-amber-400' : 'text-neutral-400'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
