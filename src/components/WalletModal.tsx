import React, { useState } from 'react';
import { 
  X, Wallet, CheckCircle2, ArrowDownRight, ExternalLink, 
  RefreshCw, ShieldCheck, Copy, Sparkles, ChevronRight, AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CryptoGateway } from '../types';
import { MetaMaskIcon, TrustWalletIcon, EthereumIcon, UsdtIcon } from './CryptoIcons';

export const WalletModal: React.FC = () => {
  const { 
    isWalletModalOpen, 
    setIsWalletModalOpen, 
    walletBalance, 
    depositViaCrypto, 
    transactions,
    connectedWallet,
    connectWallet,
    disconnectWallet
  } = useApp();

  const [selectedGateway, setSelectedGateway] = useState<CryptoGateway>('metamask');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Ethereum (ERC-20)');
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<{ amount: number; txHash: string; gateway: CryptoGateway } | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  if (!isWalletModalOpen) return null;

  const quickAmounts = [10, 25, 50, 100];
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const depositAddress = selectedGateway === 'metamask' 
    ? '0x71C8F796594c9a5933Cbe0fEf15Eb810b49f99B8' 
    : '0x39E92a3489e223fB253703c14aF0572e98a12C50';

  const handleCryptoPayment = async () => {
    if (finalAmount <= 0) return;
    setIsProcessing(true);
    setSuccessReceipt(null);

    try {
      // Connect wallet if not yet connected
      if (!connectedWallet || connectedWallet.gateway !== selectedGateway) {
        await connectWallet(selectedGateway);
      }

      // Simulate blockchain confirmation latency
      await new Promise(resolve => setTimeout(resolve, 1400));

      const txHash = `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
      depositViaCrypto(finalAmount, selectedGateway, selectedNetwork, txHash);

      setSuccessReceipt({
        amount: finalAmount,
        txHash,
        gateway: selectedGateway,
      });
      setCustomAmount('');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard?.writeText(depositAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsWalletModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base sm:text-lg">
                Crypto USD Wallet
              </h2>
              <p className="text-xs text-neutral-400">
                Deposit via Web3 MetaMask & Trust Wallet
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Connected Web3 Wallet Card */}
          {connectedWallet ? (
            <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1.5 shrink-0">
                    {connectedWallet.gateway === 'metamask' ? (
                      <MetaMaskIcon className="w-full h-full" />
                    ) : (
                      <TrustWalletIcon className="w-full h-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white capitalize">{connectedWallet.gateway}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                        Active Web3
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-400 block truncate max-w-[200px]">
                      {connectedWallet.address}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Wallet Crypto Funds</span>
                  <span className="font-mono text-base font-black text-emerald-400 tabular-nums">
                    ${connectedWallet.walletBalanceUsd.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Network: <strong className="text-neutral-200">{connectedWallet.network}</strong></span>
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">No Web3 Wallet Connected</span>
                <span className="text-[11px] text-neutral-400 mt-0.5 block">Connect MetaMask or Trust Wallet to deduct funds.</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => connectWallet('metamask')}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-neutral-700 flex items-center gap-1.5"
                >
                  <MetaMaskIcon className="w-3.5 h-3.5" />
                  <span>MetaMask</span>
                </button>
                <button
                  type="button"
                  onClick={() => connectWallet('trustwallet')}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-neutral-700 flex items-center gap-1.5"
                >
                  <TrustWalletIcon className="w-3.5 h-3.5" />
                  <span>Trust</span>
                </button>
              </div>
            </div>
          )}

          {/* USD Balance Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/30 border border-amber-500/30 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                  Available Streaming Balance
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Web3 Verified
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tabular-nums">
                  ${walletBalance.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-neutral-400 uppercase">USD</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Use your balance or pay directly from your connected MetaMask/Trust Wallet when streaming movies.
              </p>
            </div>
          </div>

          {/* Success Transaction Receipt */}
          {successReceipt && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-200 text-xs sm:text-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Deposit Confirmed (+${successReceipt.amount.toFixed(2)} USD)</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-300">
                  {successReceipt.gateway.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] text-emerald-300/80 bg-black/40 p-2 rounded-lg">
                <span className="truncate">Hash: {successReceipt.txHash}</span>
                <span className="text-emerald-400 shrink-0 ml-2">Verified</span>
              </div>
            </div>
          )}

          {/* Dedicated Crypto Payment Gateways: MetaMask & Trust Wallet */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Choose Web3 Crypto Gateway:
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* MetaMask Gateway Card */}
              <button
                type="button"
                onClick={() => setSelectedGateway('metamask')}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedGateway === 'metamask'
                    ? 'bg-neutral-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center p-1.5 border border-neutral-800">
                    <MetaMaskIcon className="w-full h-full" />
                  </div>
                  {selectedGateway === 'metamask' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">MetaMask</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Browser Extension / App</p>
                </div>
              </button>

              {/* Trust Wallet Gateway Card */}
              <button
                type="button"
                onClick={() => setSelectedGateway('trustwallet')}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedGateway === 'trustwallet'
                    ? 'bg-neutral-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center p-1.5 border border-neutral-800">
                    <TrustWalletIcon className="w-full h-full" />
                  </div>
                  {selectedGateway === 'trustwallet' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Trust Wallet</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Mobile & Multi-Chain App</p>
                </div>
              </button>
            </div>
          </div>

          {/* Network Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-400 block">
              Blockchain Network:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { name: 'Ethereum (ERC-20)', sub: 'USDT / ETH' },
                { name: 'BNB Chain (BEP-20)', sub: 'Low Fee' },
                { name: 'Polygon (POS)', sub: 'Fast 2s' },
              ].map((net) => (
                <button
                  key={net.name}
                  onClick={() => setSelectedNetwork(net.name)}
                  className={`py-2 px-2 rounded-xl border text-center transition-all ${
                    selectedNetwork === net.name
                      ? 'bg-neutral-800 border-amber-500/80 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="block truncate text-[11px]">{net.name.split(' ')[0]}</span>
                  <span className="block text-[10px] text-neutral-500 font-mono">{net.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Select Deposit Amount ($ USD):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black font-mono transition-all border ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono font-bold">$</span>
              <input
                type="number"
                min="1"
                step="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Or custom amount (e.g. 75)"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Gateway Direct Contract Address Box */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                {selectedGateway === 'metamask' ? (
                  <MetaMaskIcon className="w-4 h-4" />
                ) : (
                  <TrustWalletIcon className="w-4 h-4" />
                )}
                <span>{selectedGateway === 'metamask' ? 'MetaMask Smart Contract' : 'Trust Wallet Merchant Vault'}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">1:1 USD Rate</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-300 truncate flex-1">
                {depositAddress}
              </span>
              <button
                onClick={copyAddress}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 transition-colors shrink-0"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleCryptoPayment}
            disabled={isProcessing || finalAmount <= 0}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95 ${
              selectedGateway === 'metamask'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting to {selectedGateway === 'metamask' ? 'MetaMask' : 'Trust Wallet'}...</span>
              </>
            ) : (
              <>
                {selectedGateway === 'metamask' ? (
                  <MetaMaskIcon className="w-5 h-5" />
                ) : (
                  <TrustWalletIcon className="w-5 h-5" />
                )}
                <span>Deposit ${finalAmount.toFixed(2)} USD via {selectedGateway === 'metamask' ? 'MetaMask' : 'Trust Wallet'}</span>
              </>
            )}
          </button>

          {/* Recent Crypto Transactions Log */}
          <div className="pt-3 border-t border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Recent Blockchain Ledger
            </h3>

            {transactions.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4 text-center">
                No transactions yet.
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id}
                    className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                        {tx.gateway === 'metamask' ? (
                          <MetaMaskIcon className="w-4 h-4" />
                        ) : tx.gateway === 'trustwallet' ? (
                          <TrustWalletIcon className="w-4 h-4" />
                        ) : (
                          <Wallet className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200 block truncate max-w-[200px]">
                          {tx.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-bold ${
                        tx.type === 'deposit' ? 'text-emerald-400' : 'text-neutral-300'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">USD</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
