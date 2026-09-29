import React from 'react';
import { Film, Play, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOVIES } from '../data/movies';
import { MovieCard } from './MovieCard';

export const MyLibrary: React.FC = () => {
  const { 
    purchasedMovieIds, 
    setActiveTab, 
    playMovie,
    triggerDrmWarning
  } = useApp();

  const myMovies = MOVIES.filter(m => purchasedMovieIds.includes(m.id));

  return (
    <div className="space-y-6 pb-20 select-none px-3 sm:px-0">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/30 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Video Archive</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            My Movies (Ready to Stream)
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            All these titles were purchased with your USD balance and are unlocked for lifetime encrypted streaming.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="leading-tight">
            Encrypted Stream • Zero-Download Protected
          </span>
        </div>
      </div>

      {/* Movies Grid */}
      {myMovies.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-800/80 text-neutral-500 flex items-center justify-center mx-auto">
            <Film className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">
              No Purchased Movies Yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Top up your balance using MetaMask or Trust Wallet to purchase movies and stream them anytime online.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Movies</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Available movies: {myMovies.length}</span>
            <span className="text-emerald-400 font-medium">Permanent Web3 Streaming Active</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
            {myMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
