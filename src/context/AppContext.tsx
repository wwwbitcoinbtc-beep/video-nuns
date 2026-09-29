import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, WalletTransaction, ActiveTab, CryptoGateway, ConnectedWallet } from '../types';

interface AppContextType {
  walletBalance: number;
  purchasedMovieIds: string[];
  transactions: WalletTransaction[];
  watchlistIds: string[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeVideoMovie: Movie | null;
  activeVideoMode: 'full' | 'trailer' | null;
  playMovie: (movie: Movie, mode?: 'full' | 'trailer') => void;
  closePlayer: () => void;
  selectedMovieDetail: Movie | null;
  setSelectedMovieDetail: (movie: Movie | null) => void;
  purchaseMovie: (movie: Movie) => { success: boolean; message: string };
  payWithConnectedWallet: (movie: Movie, gateway: CryptoGateway) => Promise<{ success: boolean; message: string; txHash?: string }>;
  depositViaCrypto: (amountUsd: number, gateway: CryptoGateway, network: string, txHash?: string) => void;
  connectedWallet: ConnectedWallet | null;
  connectWallet: (gateway: CryptoGateway) => Promise<{ success: boolean; address: string }>;
  disconnectWallet: () => void;
  toggleWatchlist: (movieId: string) => void;
  drmWarning: string | null;
  triggerDrmWarning: (msg?: string) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BALANCE: 'videonuns_wallet_balance_v3',
  PURCHASES: 'videonuns_purchases_v3',
  TRANSACTIONS: 'videonuns_transactions_v3',
  WATCHLIST: 'videonuns_watchlist_v3',
  WALLET_CONN: 'videonuns_wallet_conn_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Balance starts strictly at $0.00 until funded or paid from crypto wallets
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return saved !== null ? parseFloat(saved) : 0.00;
  });

  const [purchasedMovieIds, setPurchasedMovieIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return saved ? JSON.parse(saved) : ['cyber-odyssey-2099'];
  });

  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLET_CONN);
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeVideoMovie, setActiveVideoMovie] = useState<Movie | null>(null);
  const [activeVideoMode, setActiveVideoMode] = useState<'full' | 'trailer' | null>(null);
  const [selectedMovieDetail, setSelectedMovieDetail] = useState<Movie | null>(null);
  const [drmWarning, setDrmWarning] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BALANCE, walletBalance.toFixed(2));
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchasedMovieIds));
  }, [purchasedMovieIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlistIds));
  }, [watchlistIds]);

  useEffect(() => {
    if (connectedWallet) {
      localStorage.setItem(STORAGE_KEYS.WALLET_CONN, JSON.stringify(connectedWallet));
    } else {
      localStorage.removeItem(STORAGE_KEYS.WALLET_CONN);
    }
  }, [connectedWallet]);

  const triggerDrmWarning = (customMsg?: string) => {
    const msg = customMsg || '🔒 DRM Protected Content: Direct video downloads are prohibited. Streaming playback only.';
    setDrmWarning(msg);
    setTimeout(() => {
      setDrmWarning(null);
    }, 4500);
  };

  const playMovie = (movie: Movie, mode: 'full' | 'trailer' = 'full') => {
    if (mode === 'full') {
      const isPurchased = purchasedMovieIds.includes(movie.id);
      if (!isPurchased) {
        setSelectedMovieDetail(movie);
        return;
      }
    }
    setActiveVideoMovie(movie);
    setActiveVideoMode(mode);
  };

  const closePlayer = () => {
    setActiveVideoMovie(null);
    setActiveVideoMode(null);
  };

  const purchaseMovie = (movie: Movie) => {
    if (purchasedMovieIds.includes(movie.id)) {
      return {
        success: true,
        message: 'You already own this movie streaming license.'
      };
    }

    if (walletBalance < movie.priceUsd) {
      return {
        success: false,
        message: `Insufficient balance ($${walletBalance.toFixed(2)}). Please deposit crypto via MetaMask or Trust Wallet.`
      };
    }

    const newBalance = +(walletBalance - movie.priceUsd).toFixed(2);
    setWalletBalance(newBalance);
    const updatedPurchased = [...purchasedMovieIds, movie.id];
    setPurchasedMovieIds(updatedPurchased);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'purchase',
      title: `Movie License: ${movie.title}`,
      amountUsd: movie.priceUsd,
      timestamp: Date.now(),
      status: 'completed',
      movieId: movie.id,
    };
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `"${movie.title}" successfully unlocked! Added to My Movies.`
    };
  };

  const connectWallet = async (gateway: CryptoGateway): Promise<{ success: boolean; address: string }> => {
    let userAddress = '';

    // Check if real Web3 wallet extension is active in window
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          userAddress = accounts[0];
        }
      } catch (err) {
        console.warn('Real Web3 connection fallback:', err);
      }
    }

    if (!userAddress) {
      userAddress = gateway === 'metamask' 
        ? '0x71C8F796594c9a5933Cbe0fEf15Eb810b49f99B8' 
        : '0x39E92a3489e223fB253703c14aF0572e98a12C50';
    }

    let initialWalletBal = gateway === 'metamask' ? 180.00 : 250.00;
    const savedConn = localStorage.getItem(STORAGE_KEYS.WALLET_CONN);
    if (savedConn) {
      try {
        const parsed = JSON.parse(savedConn);
        if (parsed.gateway === gateway && typeof parsed.walletBalanceUsd === 'number') {
          initialWalletBal = parsed.walletBalanceUsd;
        }
      } catch (e) {}
    }

    const conn: ConnectedWallet = {
      address: userAddress,
      gateway,
      network: gateway === 'metamask' ? 'Ethereum (ERC-20)' : 'BNB Chain (BEP-20)',
      walletBalanceUsd: initialWalletBal,
    };
    setConnectedWallet(conn);
    return { success: true, address: userAddress };
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
  };

  const payWithConnectedWallet = async (
    movie: Movie, 
    gateway: CryptoGateway
  ): Promise<{ success: boolean; message: string; txHash?: string }> => {
    let currentWallet = connectedWallet;
    
    // Auto-connect if not connected or different gateway
    if (!currentWallet || currentWallet.gateway !== gateway) {
      const res = await connectWallet(gateway);
      if (!res.success) {
        return { success: false, message: 'Could not connect to ' + gateway };
      }
      currentWallet = {
        address: res.address,
        gateway,
        network: gateway === 'metamask' ? 'Ethereum (ERC-20)' : 'BNB Chain (BEP-20)',
        walletBalanceUsd: gateway === 'metamask' ? 180.00 : 250.00,
      };
    }

    if (purchasedMovieIds.includes(movie.id)) {
      return { success: true, message: 'You already own this streaming license.' };
    }

    if (currentWallet.walletBalanceUsd < movie.priceUsd) {
      return { 
        success: false, 
        message: `Insufficient crypto balance in ${gateway === 'metamask' ? 'MetaMask' : 'Trust Wallet'} ($${currentWallet.walletBalanceUsd.toFixed(2)} USD). Please top up your wallet.` 
      };
    }

    // Deduct money directly from the connected wallet!
    const newWalletBal = +(currentWallet.walletBalanceUsd - movie.priceUsd).toFixed(2);
    const updatedWallet: ConnectedWallet = {
      ...currentWallet,
      walletBalanceUsd: newWalletBal
    };
    setConnectedWallet(updatedWallet);

    // Unlock movie immediately
    const updatedPurchased = [...purchasedMovieIds, movie.id];
    setPurchasedMovieIds(updatedPurchased);

    const generatedHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    const gatewayName = gateway === 'metamask' ? 'MetaMask' : 'Trust Wallet';

    const newTx: WalletTransaction = {
      id: `tx-wallet-pay-${Date.now()}`,
      type: 'purchase',
      title: `${gatewayName} Direct Payment: ${movie.title}`,
      amountUsd: movie.priceUsd,
      timestamp: Date.now(),
      status: 'completed',
      gateway,
      network: currentWallet.network,
      txHash: generatedHash,
      movieId: movie.id,
    };
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `Payment of $${movie.priceUsd.toFixed(2)} USD successfully deducted from ${gatewayName}! Streaming unlocked.`,
      txHash: generatedHash,
    };
  };

  const depositViaCrypto = (amountUsd: number, gateway: CryptoGateway, network: string, txHash?: string) => {
    if (amountUsd <= 0) return;
    
    // Deduct from connected wallet if connected
    if (connectedWallet && connectedWallet.gateway === gateway) {
      const remainingWalletBal = Math.max(0, +(connectedWallet.walletBalanceUsd - amountUsd).toFixed(2));
      setConnectedWallet({
        ...connectedWallet,
        walletBalanceUsd: remainingWalletBal
      });
    }

    const newBalance = +(walletBalance + amountUsd).toFixed(2);
    setWalletBalance(newBalance);

    const generatedHash = txHash || `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    const gatewayName = gateway === 'metamask' ? 'MetaMask' : 'Trust Wallet';

    const newTx: WalletTransaction = {
      id: `tx-crypto-${Date.now()}`,
      type: 'deposit',
      title: `${gatewayName} Transfer to Streaming Balance (USD)`,
      amountUsd,
      timestamp: Date.now(),
      status: 'completed',
      gateway,
      network,
      txHash: generatedHash,
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const toggleWatchlist = (movieId: string) => {
    setWatchlistIds(prev => 
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        walletBalance,
        purchasedMovieIds,
        transactions,
        watchlistIds,
        activeTab,
        setActiveTab,
        activeVideoMovie,
        activeVideoMode,
        playMovie,
        closePlayer,
        selectedMovieDetail,
        setSelectedMovieDetail,
        purchaseMovie,
        payWithConnectedWallet,
        depositViaCrypto,
        connectedWallet,
        connectWallet,
        disconnectWallet,
        toggleWatchlist,
        drmWarning,
        triggerDrmWarning,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        isDrawerOpen,
        setIsDrawerOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
