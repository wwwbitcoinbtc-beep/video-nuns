import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AndroidDrawer } from './components/AndroidDrawer';
import { VideoPlayer } from './components/VideoPlayer';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { WalletModal } from './components/WalletModal';
import { SecurityBadge } from './components/SecurityBadge';
import { HomeFeed } from './components/HomeFeed';
import { MyLibrary } from './components/MyLibrary';
import { WatchlistFeed } from './components/WatchlistFeed';
import { WalletView } from './components/WalletView';
import { MetaMaskIcon, TrustWalletIcon } from './components/CryptoIcons';
import { ShieldAlert } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    drmWarning, 
    triggerDrmWarning
  } = useApp();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'library':
        return <MyLibrary />;
      case 'wallet':
        return <WalletView />;
      case 'watchlist':
        return <WatchlistFeed />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        triggerDrmWarning();
      }}
    >
      {/* Global DRM Protection Warning Toast */}
      {drmWarning && (
        <div className="fixed top-5 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-md bg-neutral-900/95 border-2 border-rose-500/80 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium leading-tight">
            {drmWarning}
          </p>
        </div>
      )}

      {/* Main Web Experience */}
      <AndroidTopBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {renderActiveTabContent()}
      </main>

      {/* Bottom navigation fixed for mobile devices */}
      <div className="sticky bottom-0 z-30 sm:hidden">
        <AndroidBottomNav />
      </div>

      {/* Desktop Footer */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950/80 py-6 px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-300">Video-NUNS</span>
            <span>—</span>
            <span>Secure Anti-Download Video Streaming & Web3 Crypto Wallet</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              DRM Protected
            </span>
            <span>Zero Download</span>
            <span className="flex items-center gap-1">
              <MetaMaskIcon className="w-3 h-3" /> MetaMask
            </span>
            <span className="flex items-center gap-1">
              <TrustWalletIcon className="w-3 h-3" /> Trust Wallet
            </span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Overlays */}
      <VideoPlayer />
      <MovieDetailsModal />
      <WalletModal />
      <SecurityBadge />
      <AndroidDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
