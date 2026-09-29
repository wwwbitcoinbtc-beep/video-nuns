import React from 'react';
import { Play, Bookmark, Star, Lock, CheckCircle2, Film } from 'lucide-react';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { 
    purchasedMovieIds, 
    watchlistIds, 
    toggleWatchlist, 
    playMovie, 
    setSelectedMovieDetail, 
    triggerDrmWarning
  } = useApp();

  const isPurchased = purchasedMovieIds.includes(movie.id);
  const isBookmarked = watchlistIds.includes(movie.id);

  return (
    <div 
      className="group relative flex flex-col rounded-2xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 select-none cursor-pointer"
      onClick={() => setSelectedMovieDetail(movie)}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerDrmWarning();
      }}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        />

        {/* Top Overlay Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-auto">
          {isPurchased ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-xs font-semibold backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Owned</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-950/90 border border-amber-500/50 text-amber-400 font-mono text-xs font-bold backdrop-blur-md shadow-sm">
              ${movie.priceUsd.toFixed(2)} USD
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isBookmarked 
                ? 'bg-amber-500 text-neutral-950 font-bold' 
                : 'bg-neutral-950/80 text-white hover:bg-neutral-800'
            }`}
            title="Save to Watchlist"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover / Touch Quick Play Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-auto">
          <div className="w-full flex items-center gap-2">
            {isPurchased ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playMovie(movie, 'full');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Full Movie</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playMovie(movie, 'trailer');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-neutral-600 active:scale-95 transition-all"
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>Watch Trailer</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom image gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
      </div>

      {/* Movie Details Content */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Rating and Year metadata (Zero-pill compliant) */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{movie.rating}</span>
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{movie.releaseYear}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="truncate">{movie.quality}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm md:text-base text-neutral-100 group-hover:text-amber-400 transition-colors mt-1.5 line-clamp-1">
          {movie.title}
        </h3>

        {/* Genres unboxed list */}
        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
          {movie.genres.join(' · ')}
        </p>

        {/* Bottom CTA / Status Row */}
        <div className="mt-auto pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
          {isPurchased ? (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Stream Ready</span>
            </span>
          ) : (
            <div className="flex items-center gap-1 text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Locked</span>
            </div>
          )}

          <span className="text-[11px] font-mono text-neutral-400">
            {movie.durationFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};
