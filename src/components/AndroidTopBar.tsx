import React from 'react';
import { Menu, Wallet, Search, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetaMaskIcon, TrustWalletIcon } from './CryptoIcons';

export const AndroidTopBar: React.FC = () => {
  const { 
    walletBalance, 
    connectedWallet,
    setIsWalletModalOpen, 
    setIsDrawerOpen, 
    setIsSecurityModalOpen,
    searchQuery,
    setSearchQuery
  } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-3 md:px-5 py-2.5 flex items-center justify-between gap-2">
      {/* Left zone: Drawer Hamburger & Brand */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-10 h-10 rounded-full hover:bg-neutral-800 text-neutral-200 flex items-center justify-center transition-colors active:scale-95"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-rose-900/30">
            <span className="text-white font-black text-xs tracking-tighter">VN</span>
          </div>
          <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Video-NUNS
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-xs mx-2 hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, cast, director..."
            className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-amber-500/80 rounded-full pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right zone: USD Wallet Pill & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* USD Wallet Quick Balance Button */}
        {connectedWallet ? (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/50 text-neutral-200 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
            title="Connected Web3 Wallet"
          >
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              {connectedWallet.gateway === 'metamask' ? (
                <MetaMaskIcon className="w-full h-full" />
              ) : (
                <TrustWalletIcon className="w-full h-full" />
              )}
            </div>
            <span className="font-mono text-[11px] text-neutral-400 hidden sm:inline">
              {connectedWallet.address.slice(0, 6)}...
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
              ${connectedWallet.walletBalanceUsd.toFixed(2)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/50 text-neutral-200 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
            title="Connect MetaMask or Trust Wallet"
          >
            <div className="flex -space-x-1.5">
              <MetaMaskIcon className="w-3.5 h-3.5" />
              <TrustWalletIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-amber-400">
              Connect Wallet
            </span>
          </button>
        )}

        {/* Security / DRM Info trigger */}
        <button
          onClick={() => setIsSecurityModalOpen(true)}
          className="w-9 h-9 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
          title="DRM & Anti-Download Protection"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
