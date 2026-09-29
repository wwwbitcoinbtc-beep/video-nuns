export type CategoryType = 'all' | 'sci-fi' | 'action' | 'noir' | 'adventure';

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  trailerUrl: string;
  durationMinutes: number;
  durationFormatted: string;
  releaseYear: number;
  priceUsd: number;
  rating: number;
  ratingCount: string;
  genres: string[];
  director: string;
  cast: string[];
  quality: '4K Ultra HD' | '1080p FHD';
  isFeatured?: boolean;
}

export type CryptoGateway = 'metamask' | 'trustwallet';

export interface ConnectedWallet {
  address: string;
  gateway: CryptoGateway;
  network: string;
  walletBalanceUsd: number;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'purchase';
  title: string;
  amountUsd: number;
  timestamp: number;
  status: 'completed' | 'pending';
  gateway?: CryptoGateway;
  txHash?: string;
  network?: string;
  movieId?: string;
}

export type ActiveTab = 'home' | 'library' | 'wallet' | 'watchlist';
