import React, { useState } from 'react';
import { 
  X, Play, Film, Bookmark, Star, Lock, ShieldCheck, 
  CheckCircle2, Wallet, AlertCircle, Loader2, Sparkles, ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetaMaskIcon, TrustWalletIcon } from './CryptoIcons';
import { CryptoGateway } from '../types';

export const MovieDetailsModal: React.FC = () => {
  const { 
    selectedMovieDetail, 
    setSelectedMovieDetail, 
    purchasedMovieIds, 
    watchlistIds, 
    toggleWatchlist, 
    playMovie, 
    purchaseMovie,
    payWithConnectedWallet,
    connectedWallet,
    connectWallet,
    walletBalance,
    triggerDrmWarning
  } = useApp();

  const [notification, setNotification] = useState<{ text: string; error?: boolean; txHash?: string } | null>(null);
  const [payingGateway, setPayingGateway] = useState<CryptoGateway | null>(null);

  if (!selectedMovieDetail) return null;

  const movie = selectedMovieDetail;
  const isPurchased = purchasedMovieIds.includes(movie.id);
  const isBookmarked = watchlistIds.includes(movie.id);
  const canAffordBalance = walletBalance >= movie.priceUsd;

  const handleWalletPayment = async (gateway: CryptoGateway) => {
    setPayingGateway(gateway);
    setNotification(null);
    try {
      // Simulate blockchain signature & network verification
      await new Promise(r => setTimeout(r, 1400));
      const res = await payWithConnectedWallet(movie, gateway);
      if (res.success) {
        setNotification({ text: res.message, error: false, txHash: res.txHash });
      } else {
        setNotification({ text: res.message, error: true });
      }
    } finally {
      setPayingGateway(null);
    }
  };

  const handleBalancePurchase = () => {
    const res = purchaseMovie(movie);
    if (res.success) {
      setNotification({ text: res.message, error: false });
    } else {
      setNotification({ text: res.message, error: true });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        triggerDrmWarning();
      }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setSelectedMovieDetail(null)}
      />

      {/* Sheet / Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Mobile Drag Indicator Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-700 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Header / Backdrop Image */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden shrink-0 bg-black">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center pointer-events-none opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-black/30" />

          {/* Close & Action Buttons */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <button
              onClick={() => setSelectedMovieDetail(null)}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={() => toggleWatchlist(movie.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                isBookmarked 
                  ? 'bg-amber-500 text-neutral-950 font-bold' 
                  : 'bg-black/60 text-white hover:bg-black/90'
              }`}
              title="Save to Watchlist"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Title and metadata on backdrop */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-6">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{movie.rating}</span>
              </span>
              <span>·</span>
              <span>{movie.releaseYear}</span>
              <span>·</span>
              <span>{movie.quality}</span>
              <span>·</span>
              <span>{movie.durationFormatted}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {movie.title}
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">{movie.originalTitle}</p>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {notification && (
            <div className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
              notification.error 
                ? 'bg-rose-950/40 border-rose-800 text-rose-200' 
                : 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
            }`}>
              {notification.error ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
              <span className="flex-1">{notification.text}</span>
            </div>
          )}

          {/* DRM Stream Notice */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Encrypted Online Stream • Zero-Download Protected</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">Widevine L1</span>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Synopsis
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {movie.description}
            </p>
          </div>

          {/* Cast & Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-neutral-800/80">
            <div>
              <span className="text-neutral-500 block">Director</span>
              <span className="text-neutral-200 font-medium">{movie.director}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Starring</span>
              <span className="text-neutral-200 font-medium">{movie.cast.join(', ')}</span>
            </div>
          </div>

          {/* Pricing & Web3 Wallet Info card */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-neutral-400 block font-medium">
                  Lifetime Streaming License
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums">
                    ${movie.priceUsd.toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-400 uppercase font-medium">USD</span>
                </div>
              </div>

              {connectedWallet ? (
                <div className="text-xs bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl text-left sm:text-right w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 justify-start sm:justify-end text-neutral-300 font-medium">
                    {connectedWallet.gateway === 'metamask' ? (
                      <MetaMaskIcon className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <TrustWalletIcon className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="capitalize">{connectedWallet.gateway === 'metamask' ? 'MetaMask' : 'Trust Wallet'}</span>
                    <span className="font-mono text-[11px] text-neutral-400 truncate max-w-[90px]">{connectedWallet.address}</span>
                  </div>
                  <div className="mt-1 text-emerald-400 font-mono text-[11px]">
                    Wallet Funds: <span className="font-bold">${connectedWallet.walletBalanceUsd.toFixed(2)} USD</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-neutral-400 text-left sm:text-right">
                  <div className="text-[11px] text-amber-400/90 font-medium">
                    Direct Web3 Payment
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    MetaMask & Trust Wallet supported
                  </div>
                </div>
              )}
            </div>

            {notification?.txHash && (
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-emerald-500/30 text-[11px] font-mono text-neutral-300 flex items-center justify-between gap-2 overflow-hidden">
                <span className="text-emerald-400 truncate">Tx: {notification.txHash}</span>
                <span className="text-neutral-500 shrink-0">Confirmed</span>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex flex-col gap-2.5 shrink-0">
          {isPurchased ? (
            <div className="flex items-center gap-2.5 w-full">
              <button
                onClick={() => {
                  setSelectedMovieDetail(null);
                  playMovie(movie, 'full');
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Stream Movie Now (Unlocked)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-center sm:text-left">
                Pay & Unlock Streaming Directly from Wallet:
              </div>

              {/* Two Direct Web3 Wallet Payment Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  disabled={payingGateway !== null}
                  onClick={() => handleWalletPayment('metamask')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
                    payingGateway === 'metamask'
                      ? 'bg-neutral-800 text-amber-400 border border-amber-500/50'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-amber-500/40 hover:border-amber-500 shadow-amber-500/10'
                  }`}
                >
                  {payingGateway === 'metamask' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Confirming on Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <MetaMaskIcon className="w-4 h-4 shrink-0" />
                      <span>Pay with MetaMask (${movie.priceUsd.toFixed(2)})</span>
                    </>
                  )}
                </button>

                <button
                  disabled={payingGateway !== null}
                  onClick={() => handleWalletPayment('trustwallet')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
                    payingGateway === 'trustwallet'
                      ? 'bg-neutral-800 text-blue-400 border border-blue-500/50'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-blue-500/40 hover:border-blue-500 shadow-blue-500/10'
                  }`}
                >
                  {payingGateway === 'trustwallet' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Confirming on Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <TrustWalletIcon className="w-4 h-4 shrink-0" />
                      <span>Pay with Trust Wallet (${movie.priceUsd.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>

              {canAffordBalance && (
                <button
                  onClick={handleBalancePurchase}
                  className="w-full py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-800"
                >
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Or use Account Balance (${walletBalance.toFixed(2)} USD available)</span>
                </button>
              )}

              <div className="flex justify-center pt-1">
                <button
                  onClick={() => {
                    playMovie(movie, 'trailer');
                  }}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Watch Free Trailer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
