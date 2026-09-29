import React, { useState, useMemo } from 'react';
import { Film, Wallet, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOVIES } from '../data/movies';
import { MovieCard } from './MovieCard';
import { CategoryType } from '../types';
import { MetaMaskIcon, TrustWalletIcon } from './CryptoIcons';

export const HomeFeed: React.FC = () => {
  const { 
    setIsWalletModalOpen,
    searchQuery,
    setSearchQuery,
    connectedWallet,
    connectWallet
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = movie.title.toLowerCase().includes(q);
        const matchDirector = movie.director.toLowerCase().includes(q);
        const matchCast = movie.cast.some(c => c.toLowerCase().includes(q));
        if (!matchTitle && !matchDirector && !matchCast) return false;
      }

      if (activeCategory === 'all') return true;
      if (activeCategory === 'sci-fi') return movie.genres.includes('Sci-Fi');
      if (activeCategory === 'action') return movie.genres.includes('Action');
      if (activeCategory === 'noir') return movie.genres.includes('Noir');
      if (activeCategory === 'adventure') return movie.genres.includes('Adventure');
      return true;
    });
  }, [searchQuery, activeCategory]);

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All Movies' },
    { id: 'sci-fi', label: 'Sci-Fi' },
    { id: 'action', label: 'Action & Thriller' },
    { id: 'noir', label: 'Noir Mystery' },
    { id: 'adventure', label: 'Adventure' },
  ];

  return (
    <div className="space-y-6 pb-20 select-none">
      {/* Mobile Search Input */}
      <div className="sm:hidden px-3 pt-2">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, cast, director..."
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-full pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Animated Top Web3 Crypto Gateways Bar */}
      <div className="mx-3 sm:mx-0 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/50 border border-amber-500/30 animate-pulse-glow flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          {/* Animated Floating Web3 Icons */}
          <div className="flex -space-x-3 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-amber-500/40 flex items-center justify-center p-2 shadow-lg shadow-amber-500/10 animate-float-icon">
              <MetaMaskIcon className="w-full h-full" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-blue-500/40 flex items-center justify-center p-2 shadow-lg shadow-blue-500/10 animate-float-icon" style={{ animationDelay: '1.7s' }}>
              <TrustWalletIcon className="w-full h-full" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
                <span>Web3 Gateways: MetaMask & Trust Wallet</span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/60 uppercase">
                  {connectedWallet ? 'Connected' : 'Ready'}
                </span>
              </h3>
            </div>
            {connectedWallet ? (
              <p className="text-xs text-neutral-300 mt-0.5 flex items-center gap-2">
                <span>Active: <strong className="text-white capitalize">{connectedWallet.gateway}</strong></span>
                <span>•</span>
                <span className="font-mono text-neutral-400">{connectedWallet.address.slice(0, 8)}...</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold font-mono">${connectedWallet.walletBalanceUsd.toFixed(2)} USD</span>
              </p>
            ) : (
              <p className="text-xs text-neutral-400 mt-0.5">
                Connect your crypto wallet to pay and stream movies directly.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {connectedWallet ? (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-neutral-700 shadow-md active:scale-95"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Manage Web3 Wallet</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => connectWallet('metamask')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/50 hover:border-amber-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <MetaMaskIcon className="w-4 h-4 shrink-0" />
                <span>Connect MetaMask</span>
              </button>

              <button
                onClick={() => connectWallet('trustwallet')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-blue-500/50 hover:border-blue-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <TrustWalletIcon className="w-4 h-4 shrink-0" />
                <span>Connect Trust Wallet</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category Segmented Filter Tabs */}
      <div className="px-3 sm:px-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid Section */}
      <div className="px-3 sm:px-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {searchQuery ? `Search Results for: "${searchQuery}"` : 'Featured Video Catalog'}
            </h2>
            <p className="text-xs text-neutral-400">
              Direct secure online streaming • Zero download policy
            </p>
          </div>

          <span className="text-xs font-mono text-neutral-400">
            {filteredMovies.length} titles
          </span>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6">
            <Film className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-300 font-medium">
              No movies found matching criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
