import React, { useState } from 'react';
import { Book, BookEdition } from '../types';
import confetti from 'canvas-confetti';
import { ShoppingCart, CheckCircle, ShieldCheck, Tag, CreditCard, Sparkles, X, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  selectedEdition?: BookEdition;
  onConfirmPurchase: (book: Book, edition: BookEdition) => void;
  isOwned: boolean;
  onStartReading: (bookId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  book,
  selectedEdition,
  onConfirmPurchase,
  isOwned,
  onStartReading
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'card'>('balance');

  if (!isOpen) return null;

  const releaseTime = new Date(book.releaseDate).getTime();
  const now = Date.now();
  const daysSinceRelease = (now - releaseTime) / (1000 * 60 * 60 * 24);
  const isLaunchWindow = daysSinceRelease <= (book.promotionalPeriodDays || 7);
  const finalPrice = isLaunchWindow ? book.launchPriceUSD : book.regularPriceUSD;
  const savings = book.regularPriceUSD - finalPrice;

  const currentEdition = selectedEdition || book.availableEditions[0];

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseComplete(true);
      onConfirmPurchase(book, currentEdition);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  const handleFinishAndRead = () => {
    setPurchaseComplete(false);
    onClose();
    onStartReading(book.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 text-[#0D5EAF] border border-sky-200">
              <ShoppingCart className="w-4 h-4 text-[#0D5EAF]" />
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {purchaseComplete ? 'Purchase Confirmed' : 'Simulated Checkout'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {purchaseComplete ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900">
                You now own this book!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Receipt #NOV-REC-{Math.floor(10000 + Math.random() * 90000)} generated. Saved to My Library.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Book Title:</span>
                <span className="font-semibold text-slate-900">{book.title}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Authorized Edition:</span>
                <span className="text-slate-900">{currentEdition.language} ({currentEdition.type === 'publisher_approved' ? 'Publisher Approved' : 'Original'})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-mono text-[#0D5EAF] font-bold text-sm">${finalPrice.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleFinishAndRead}
                className="flex-1 py-3 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                <span>Open in Reader Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Book Item card */}
            <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-16 h-22 object-cover rounded-xl shadow-md shrink-0 bg-slate-100"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0D5EAF] font-bold">
                  {book.genre}
                </span>
                <h4 className="text-sm font-serif font-bold text-slate-900 truncate mt-0.5">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">By {book.author}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                  <span>Edition:</span>
                  <span className="text-slate-900 font-semibold">
                    {currentEdition.language}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Promotional pricing highlight */}
            {isLaunchWindow ? (
              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-[#0D5EAF] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#0D5EAF]">
                    7-Day Launch Window Promotional Price Active!
                  </p>
                  <p className="text-sky-900/80 text-[11px] mt-0.5">
                    Launch Price: <strong>${book.launchPriceUSD.toFixed(2)}</strong> (50% off regular ${book.regularPriceUSD.toFixed(2)}).
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                <span>Standard Catalog Price:</span>
                <span className="font-mono text-slate-900 font-bold">${book.regularPriceUSD.toFixed(2)}</span>
              </div>
            )}

            {/* Payment Method Selector (Simulated) */}
            <div>
              <p className="text-xs font-semibold text-slate-800 mb-2">Simulated Payment Method:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('balance')}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    paymentMethod === 'balance'
                      ? 'bg-sky-50 border-[#0D5EAF] text-slate-900 ring-1 ring-[#0D5EAF]/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    <span>Novelia Credits</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Balance: $45.00 USD
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-sky-50 border-[#0D5EAF] text-slate-900 ring-1 ring-[#0D5EAF]/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <CreditCard className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    <span>Demo Visa •••• 4021</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Instant Simulation
                  </span>
                </button>
              </div>
            </div>

            {/* Order Calculation summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Catalog Regular Price:</span>
                <span className="font-mono">${book.regularPriceUSD.toFixed(2)}</span>
              </div>
              {isLaunchWindow && (
                <div className="flex justify-between text-[#0D5EAF] font-semibold">
                  <span>Launch Window Discount:</span>
                  <span className="font-mono">-${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Digital Delivery & Tax:</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-bold text-sm">
                <span>Total Due:</span>
                <span className="font-mono text-[#0D5EAF]">${finalPrice.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Confirm button */}
            <div className="space-y-2">
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full py-3 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Simulated Transaction...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Purchase (${finalPrice.toFixed(2)} USD)</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-500 text-center">
                Simulated transaction for client demo · No actual credit card is charged
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
