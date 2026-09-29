import React from 'react';
import { 
  X, Home, Film, Wallet, Bookmark, ShieldCheck, 
  PlusCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetaMaskIcon, TrustWalletIcon } from './CryptoIcons';

export const AndroidDrawer: React.FC = () => {
  const { 
    isDrawerOpen, 
    setIsDrawerOpen, 
    activeTab, 
    setActiveTab, 
    walletBalance, 
    setIsWalletModalOpen,
    setIsSecurityModalOpen,
    purchasedMovieIds,
    connectedWallet
  } = useApp();

  if (!isDrawerOpen) return null;

  const handleSelectTab = (tab: any) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Container (Material 3 Sheet) */}
      <div className="relative z-10 w-80 max-w-[85vw] h-full bg-neutral-900 border-r border-neutral-800 flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header / User Profile Banner */}
        <div className="p-5 bg-gradient-to-br from-neutral-800 to-neutral-950 border-b border-neutral-800 relative">
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
              VN
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm">
                  Web3 Member
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                {connectedWallet ? `${connectedWallet.address} (${connectedWallet.gateway})` : 'web3.user@videonuns.io'}
              </p>
            </div>
          </div>

          {/* Quick Wallet Summary Card inside Drawer */}
          <div className="mt-4 p-3.5 rounded-xl bg-neutral-950/80 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 block font-medium">
                USD Balance
              </span>
              <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                ${walletBalance.toFixed(2)} USD
              </span>
            </div>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setIsWalletModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>
          </div>

          {/* Active Crypto Gateways badge */}
          <div className="mt-2.5 flex items-center gap-2 text-[10px] text-neutral-400">
            <span>Supported Gateways:</span>
            <span className="inline-flex items-center gap-1 text-neutral-300 font-medium">
              <MetaMaskIcon className="w-3.5 h-3.5" /> MetaMask
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-neutral-300 font-medium">
              <TrustWalletIcon className="w-3.5 h-3.5" /> Trust Wallet
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 flex-1 space-y-1">
          <div className="text-[11px] font-semibold text-neutral-500 px-3 py-1 uppercase tracking-wider">
            Navigation
          </div>

          <button
            onClick={() => handleSelectTab('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'home' ? 'bg-amber-500/15 text-amber-400' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="flex-1 text-left">Explore Movies</span>
          </button>

          <button
            onClick={() => handleSelectTab('library')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'library' ? 'bg-amber-500/15 text-amber-400' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span className="flex-1 text-left">My Purchased Movies</span>
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono">
              {purchasedMovieIds.length}
            </span>
          </button>

          <button
            onClick={() => handleSelectTab('wallet')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'wallet' ? 'bg-amber-500/15 text-amber-400' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="flex-1 text-left">Crypto Wallet & Ledger</span>
          </button>

          <button
            onClick={() => handleSelectTab('watchlist')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'watchlist' ? 'bg-amber-500/15 text-amber-400' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="flex-1 text-left">Saved Watchlist</span>
          </button>

          <div className="pt-3 border-t border-neutral-800 my-2">
            <div className="text-[11px] font-semibold text-neutral-500 px-3 py-1 uppercase tracking-wider">
              Security & Options
            </div>

            {/* DRM Anti-Download Info */}
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setIsSecurityModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-neutral-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="flex-1 text-left">Anti-Download DRM Protocol</span>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-500 text-center">
          <p className="font-mono text-[10px]">Video-NUNS v3.5 • Widevine L1 • Web3</p>
          <p className="mt-0.5">Streaming Rights Protected © 2026</p>
        </div>
      </div>
    </div>
  );
};
