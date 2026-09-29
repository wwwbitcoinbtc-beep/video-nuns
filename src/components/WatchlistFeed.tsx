import React from 'react';
import { Bookmark, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOVIES } from '../data/movies';
import { MovieCard } from './MovieCard';

export const WatchlistFeed: React.FC = () => {
  const { 
    watchlistIds, 
    setActiveTab 
  } = useApp();

  const savedMovies = MOVIES.filter(m => watchlistIds.includes(m.id));

  return (
    <div className="space-y-6 pb-20 select-none px-3 sm:px-0">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>Saved Watchlist</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            My Watchlist
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Movies you bookmarked for later purchase and viewing.
          </p>
        </div>

        <span className="text-xs font-mono bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-neutral-300">
          {savedMovies.length} items
        </span>
      </div>

      {/* Grid */}
      {savedMovies.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-800/80 text-neutral-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">
              Your Watchlist is Empty
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Save movies by tapping the bookmark icon on any poster.
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          {savedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
