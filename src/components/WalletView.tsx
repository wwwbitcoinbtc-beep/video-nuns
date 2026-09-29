import React, { useState } from 'react';
import { 
  Wallet, ArrowDownRight, ArrowUpRight, Copy, CheckCircle2, 
  ShieldCheck, PlusCircle, RefreshCw, ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CryptoGateway } from '../types';
import { MetaMaskIcon, TrustWalletIcon, EthereumIcon, UsdtIcon } from './CryptoIcons';

export const WalletView: React.FC = () => {
  const { 
    walletBalance, 
    depositViaCrypto, 
    transactions, 
    setActiveTab,
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
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'purchase'>('all');

  const quickAmounts = [10, 25, 50, 100];
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const depositAddress = selectedGateway === 'metamask' 
    ? '0x71C8F796594c9a5933Cbe0fEf15Eb810b49f99B8' 
    : '0x39E92a3489e223fB253703c14aF0572e98a12C50';

  const handleDeposit = async () => {
    if (finalAmount <= 0) return;
    setIsProcessing(true);
    setSuccessReceipt(null);

    try {
      if (!connectedWallet || connectedWallet.gateway !== selectedGateway) {
        await connectWallet(selectedGateway);
      }

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

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  return (
    <div className="space-y-6 pb-20 select-none px-3 sm:px-0">
      {/* Top Header Card with USD Balance */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <Wallet className="w-4 h-4" />
              <span>Video-NUNS Web3 USD Wallet</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tabular-nums">
                ${walletBalance.toFixed(2)}
              </span>
              <span className="text-base sm:text-lg font-bold text-neutral-400 uppercase">USD</span>
            </div>
            <p className="text-xs text-neutral-300 mt-2 max-w-lg">
              Decentralized crypto funding powered exclusively by MetaMask and Trust Wallet gateways for instant movie unlocking.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
            >
              Browse Movies
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-emerald-400 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>MetaMask & Trust Wallet Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successReceipt && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-200 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">Deposit Successful! (+${successReceipt.amount.toFixed(2)} USD)</p>
              <p className="font-mono text-xs text-emerald-300/80 mt-0.5 truncate max-w-md">
                TX: {successReceipt.txHash}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-900/60 px-2.5 py-1 rounded text-emerald-300 shrink-0 uppercase">
            {successReceipt.gateway}
          </span>
        </div>
      )}

      {/* Connected Web3 Wallet Banner */}
      {connectedWallet ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center p-2 shrink-0">
              {connectedWallet.gateway === 'metamask' ? (
                <MetaMaskIcon className="w-full h-full" />
              ) : (
                <TrustWalletIcon className="w-full h-full" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white capitalize text-sm sm:text-base">{connectedWallet.gateway}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/90 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  Connected & Verified
                </span>
              </div>
              <div className="font-mono text-xs text-neutral-400 mt-0.5">
                {connectedWallet.address} • {connectedWallet.network}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Available in Wallet</span>
              <span className="text-lg font-black font-mono text-emerald-400 tabular-nums">
                ${connectedWallet.walletBalanceUsd.toFixed(2)} USD
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors border border-neutral-700"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-extrabold text-white text-sm sm:text-base block">No Web3 Wallet Connected</span>
            <span className="text-xs text-neutral-400 mt-0.5 block">Connect MetaMask or Trust Wallet to pay for movies or deposit funds directly.</span>
          </div>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => connectWallet('metamask')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-amber-500/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <MetaMaskIcon className="w-4 h-4 shrink-0" />
              <span>Connect MetaMask</span>
            </button>
            <button
              onClick={() => connectWallet('trustwallet')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-blue-500/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <TrustWalletIcon className="w-4 h-4 shrink-0" />
              <span>Connect Trust Wallet</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Crypto Top-Up Form & Blockchain Transaction Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dedicated Crypto Gateways (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>Deposit with Cryptocurrency</span>
            </h2>
            <span className="text-xs text-neutral-400">MetaMask & Trust Wallet</span>
          </div>

          {/* Gateways: MetaMask & Trust Wallet with real branded icons */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Select Crypto Gateway:
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* MetaMask Card */}
              <button
                type="button"
                onClick={() => setSelectedGateway('metamask')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selectedGateway === 'metamask'
                    ? 'bg-neutral-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/60'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center p-2 border border-neutral-800 shadow-md">
                    <MetaMaskIcon className="w-full h-full" />
                  </div>
                  {selectedGateway === 'metamask' && (
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">MetaMask</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">Direct Web3 Browser & Mobile Extension</p>
                </div>
              </button>

              {/* Trust Wallet Card */}
              <button
                type="button"
                onClick={() => setSelectedGateway('trustwallet')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selectedGateway === 'trustwallet'
                    ? 'bg-neutral-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/60'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center p-2 border border-neutral-800 shadow-md">
                    <TrustWalletIcon className="w-full h-full" />
                  </div>
                  {selectedGateway === 'trustwallet' && (
                    <span className="w-3 h-3 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">Trust Wallet</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">Multi-chain mobile app & browser wallet</p>
                </div>
              </button>
            </div>
          </div>

          {/* Network Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-400 block">
              Blockchain Protocol / Network:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { name: 'Ethereum (ERC-20)', sub: 'USDT / ETH' },
                { name: 'BNB Chain (BEP-20)', sub: 'Fast & Low Fee' },
                { name: 'Polygon (POS)', sub: 'Sub-cent Gas' },
              ].map((net) => (
                <button
                  key={net.name}
                  onClick={() => setSelectedNetwork(net.name)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                    selectedNetwork === net.name
                      ? 'bg-neutral-800 border-amber-500/80 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="block truncate text-xs font-semibold">{net.name.split(' ')[0]}</span>
                  <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">{net.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Deposit Amount in USD:
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-3 px-2 rounded-2xl text-sm font-black font-mono transition-all border ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md scale-102'
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
                placeholder="Custom USD amount (e.g. 50)"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl pl-8 pr-3 py-2.5 text-sm text-white font-mono placeholder-neutral-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Gateway Direct Smart Contract Box */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-300 font-medium">
                {selectedGateway === 'metamask' ? (
                  <MetaMaskIcon className="w-5 h-5" />
                ) : (
                  <TrustWalletIcon className="w-5 h-5" />
                )}
                <span>
                  {selectedGateway === 'metamask' ? 'MetaMask Verified Contract' : 'Trust Wallet Verified Vault'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">1:1 USD Rate</span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-mono text-neutral-300 truncate flex-1">
                {depositAddress}
              </span>
              <button
                onClick={copyAddress}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Submit Crypto Payment */}
          <button
            onClick={handleDeposit}
            disabled={isProcessing || finalAmount <= 0}
            className={`w-full py-4 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95 ${
              selectedGateway === 'metamask'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Confirming transaction with {selectedGateway === 'metamask' ? 'MetaMask' : 'Trust Wallet'}...</span>
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
        </div>

        {/* Right Column: Crypto Ledger History (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Blockchain Ledger
            </h2>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded ${filterType === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('deposit')}
                className={`px-2 py-0.5 rounded ${filterType === 'deposit' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400'}`}
              >
                Deposits
              </button>
              <button
                onClick={() => setFilterType('purchase')}
                className={`px-2 py-0.5 rounded ${filterType === 'purchase' ? 'bg-neutral-800 text-rose-400' : 'text-neutral-400'}`}
              >
                Purchases
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-xs text-neutral-500 py-12 text-center">
              No transactions recorded in this category.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                      {tx.gateway === 'metamask' ? (
                        <MetaMaskIcon className="w-4 h-4" />
                      ) : tx.gateway === 'trustwallet' ? (
                        <TrustWalletIcon className="w-4 h-4" />
                      ) : (
                        <Wallet className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-200 block line-clamp-1">
                        {tx.title}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(tx.timestamp).toLocaleDateString()} · {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-bold font-mono text-xs tabular-nums ${
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
  );
};
