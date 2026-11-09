import React, { useState } from 'react';
import { Book, Transaction, ReaderProgress, UserProfile } from '../types';
import {
  BookOpen,
  Clock,
  Heart,
  CreditCard,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Download,
  User,
  ShieldCheck,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Wallet
} from 'lucide-react';

interface ReaderDashboardProps {
  activeTab: 'library' | 'progress' | 'favorites' | 'subscriptions' | 'profile';
  onSelectTab: (tab: any) => void;
  books: Book[];
  userPurchasedBookIds: string[];
  favorites: string[];
  readingProgress: Record<string, ReaderProgress>;
  transactions: Transaction[];
  profile: UserProfile;
  onOpenReader: (bookId: string) => void;
  onSelectBook: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
  onOpenProfileModal?: () => void;
}

export const ReaderDashboard: React.FC<ReaderDashboardProps> = ({
  activeTab,
  onSelectTab,
  books,
  userPurchasedBookIds,
  favorites,
  readingProgress,
  transactions,
  profile,
  onOpenReader,
  onSelectBook,
  onToggleFavorite,
  onOpenProfileModal
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [activePlan, setActivePlan] = useState<'free' | 'explorer'>('explorer');

  const libraryBooks = books.filter(b => userPurchasedBookIds.includes(b.id));
  const favoriteBooks = books.filter(b => favorites.includes(b.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-amber-100/90 pb-2 overflow-x-auto">
        <button
          onClick={() => onSelectTab('library')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'library'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          My Library ({libraryBooks.length})
        </button>

        <button
          onClick={() => onSelectTab('progress')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'progress'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Reading Progress
        </button>

        <button
          onClick={() => onSelectTab('favorites')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Wishlist & Favorites ({favoriteBooks.length})
        </button>

        <button
          onClick={() => onSelectTab('subscriptions')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'subscriptions'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Novelia Pass & Receipts
        </button>

        {/* Profile Section Tab */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Reader Profile & ID</span>
        </button>
      </div>

      {/* 1. MY LIBRARY TAB */}
      {activeTab === 'library' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Purchased Digital Books
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Lifetime reading rights with authorized language editions and StorySound access
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">
              {libraryBooks.length} titles in cloud vault
            </span>
          </div>

          {libraryBooks.length === 0 ? (
            <div className="text-center py-16 border border-stone-200 rounded-3xl bg-white shadow-xs">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm text-stone-700 font-medium">Your library is currently empty.</p>
              <p className="text-xs text-stone-500 mt-1">
                Browse the marketplace to discover world literature with launch promotional pricing ($2.00).
              </p>
              <button
                onClick={() => onSelectTab('discover')}
                className="mt-4 px-5 py-2.5 bg-[#0D5EAF] hover:bg-[#094787] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryBooks.map(book => {
                const prog = readingProgress[book.id];
                const percent = prog ? prog.completionPercentage : 35;

                return (
                  <div
                    key={book.id}
                    className="p-4 bg-white border border-stone-200/90 rounded-2xl flex gap-4 hover:border-amber-300 hover:shadow-md transition-all shadow-2xs"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 aspect-[3/4] object-cover rounded-xl shadow-xs shrink-0 bg-stone-100 cursor-pointer"
                      onClick={() => onOpenReader(book.id)}
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <span className="text-[10px] font-mono text-[#0D5EAF] font-bold uppercase">
                          {book.genre}
                        </span>
                        <h3
                          onClick={() => onOpenReader(book.id)}
                          className="text-sm font-serif font-bold text-stone-900 truncate mt-0.5 hover:text-[#0D5EAF] cursor-pointer"
                        >
                          {book.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">By {book.author}</p>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
                            <span>Progress</span>
                            <span className="font-mono text-[#0D5EAF] font-semibold">{percent}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#0D5EAF] h-full rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-stone-400">
                          {book.chapters.length} Chapters
                        </span>
                        <button
                          onClick={() => onOpenReader(book.id)}
                          className="px-3 py-1.5 bg-[#0D5EAF] hover:bg-[#094787] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Continue</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 2. READING PROGRESS TAB */}
      {activeTab === 'progress' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Active Reading Progress & Bookmarks
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Automatic progress synchronization per NOVELIA business rule BR-06
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {libraryBooks.map(book => {
              const prog = readingProgress[book.id];
              const percent = prog ? prog.completionPercentage : 40;
              const chapterNum = 1;

              return (
                <div
                  key={book.id}
                  className="p-5 bg-white border border-stone-200/90 rounded-2xl flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-colors"
                >
                  <div className="flex gap-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-20 aspect-[3/4] object-cover rounded-xl shadow-xs shrink-0 bg-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-[#0D5EAF] font-bold uppercase">
                        Current Session
                      </span>
                      <h3 className="text-base font-serif font-bold text-stone-900 truncate mt-0.5">
                        {book.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">By {book.author}</p>

                      <div className="mt-3 p-3 bg-[#fcfaf5] rounded-xl border border-stone-200 text-xs">
                        <div className="flex justify-between text-stone-700">
                          <span>Last Position:</span>
                          <span className="font-semibold text-stone-900">
                            Chapter {chapterNum} (“{book.chapters[0]?.title}”)
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-500 mt-1">
                          <span>Completion:</span>
                          <span className="font-mono text-[#0D5EAF] font-bold">{percent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-mono">
                      Last read: Today, 3:15 PM
                    </span>
                    <button
                      onClick={() => onOpenReader(book.id)}
                      className="px-4 py-2 bg-[#0D5EAF] hover:bg-[#094787] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Resume Chapter {chapterNum}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. FAVORITES & WISHLIST TAB */}
      {activeTab === 'favorites' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Wishlist & Saved Favorites
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Track titles for future purchase or monitor upcoming price shifts
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">
              {favoriteBooks.length} saved
            </span>
          </div>

          {favoriteBooks.length === 0 ? (
            <div className="text-center py-16 border border-stone-200 rounded-3xl bg-white shadow-xs">
              <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm text-stone-700 font-medium">No favorites saved yet.</p>
              <p className="text-xs text-stone-500 mt-1">
                Click the heart icon on any book in the marketplace to add it to your wishlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteBooks.map(book => (
                <div
                  key={book.id}
                  className="bg-white border border-stone-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-colors"
                >
                  <div>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full aspect-[3/4] object-cover rounded-xl shadow-xs bg-stone-100 cursor-pointer"
                      onClick={() => onSelectBook(book)}
                    />
                    <h3
                      onClick={() => onSelectBook(book)}
                      className="text-sm font-serif font-bold text-stone-900 mt-3 truncate hover:text-[#0D5EAF] cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">By {book.author}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0D5EAF]">
                      ${book.launchPriceUSD.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onSelectBook(book)}
                      className="px-3 py-1.5 bg-[#0D5EAF] hover:bg-[#094787] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. SUBSCRIPTIONS & RECEIPTS TAB */}
      {activeTab === 'subscriptions' && (
        <section className="space-y-10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Novelia Pass — Reader Membership (Demo)
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Explore prototype subscription tiers (PRD Section 6.4: Subscriptions)
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Plan 1: Free Explorer */}
              <div
                className={`p-6 rounded-3xl border transition-all ${
                  activePlan === 'free'
                    ? 'bg-white border-[#0D5EAF] ring-2 ring-sky-200 shadow-md'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Standard Reader</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Pay-as-you-read individual books</p>
                  </div>
                  <span className="text-lg font-bold font-mono text-stone-900">$0 / mo</span>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Purchase individual titles at $2.00 Launch / $4.00 Regular</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free sample previews (Chapter 1)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>StorySound instrumental accompaniment</span>
                  </li>
                </ul>

                <button
                  onClick={() => setActivePlan('free')}
                  className={`mt-6 w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activePlan === 'free'
                      ? 'bg-stone-100 text-stone-600 font-bold'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {activePlan === 'free' ? 'Current Plan' : 'Select Free Plan'}
                </button>
              </div>

              {/* Plan 2: Novelia Global Explorer */}
              <div
                className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
                  activePlan === 'explorer'
                    ? 'bg-white border-[#0D5EAF] ring-2 ring-sky-200 shadow-lg'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="absolute top-0 right-0 bg-[#0D5EAF] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider font-mono">
                  Recommended
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Novelia Global Explorer</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Unlimited reading pass & exclusive releases</p>
                  </div>
                  <span className="text-lg font-bold font-mono text-[#0D5EAF]">$9.99 / mo</span>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    <span>Unlimited reading across all participating publisher catalogs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    <span>Unlimited authorized language editions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    <span>Early 48-hour access to upcoming book releases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    <span>Priority ROX AI deep passage analysis</span>
                  </li>
                </ul>

                <button
                  onClick={() => setActivePlan('explorer')}
                  className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activePlan === 'explorer'
                      ? 'bg-[#0D5EAF] text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#0D5EAF] hover:bg-[#094787] text-white'
                  }`}
                >
                  {activePlan === 'explorer' ? 'Active Subscription (Demo)' : 'Upgrade to Explorer Pass'}
                </button>
              </div>
            </div>
          </div>

          {/* Payment History & Receipts Table */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Simulated Transaction History & Invoices
                </h3>
                <p className="text-xs text-stone-500">
                  Transaction records, status, and printable itemized receipts
                </p>
              </div>
              <span className="text-xs font-mono text-stone-500">
                {transactions.length} record(s)
              </span>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-2xl bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fcfaf5] text-stone-600 font-mono text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Item & Edition</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-stone-600 font-medium">
                        {tx.receiptNumber}
                      </td>
                      <td className="py-3 px-4 text-stone-900 font-semibold">
                        {tx.bookTitle || 'Subscription Plan'}
                        {tx.editionLanguage && (
                          <span className="text-[10px] text-stone-500 block font-normal">
                            {tx.editionLanguage}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0D5EAF]">
                        ${tx.amountUSD.toFixed(2)} USD
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Successful</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0D5EAF] font-medium text-[11px] transition-colors cursor-pointer border border-sky-200"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Receipt Modal */}
          {selectedReceipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="font-serif font-bold text-base text-stone-900">
                    NOVELIA Payment Receipt
                  </span>
                  <button
                    onClick={() => setSelectedReceipt(null)}
                    className="text-stone-400 hover:text-stone-800 text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="p-4 bg-[#fcfaf5] rounded-2xl space-y-2 text-xs text-stone-600 border border-stone-200">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Receipt ID:</span>
                    <span className="font-mono text-stone-900 font-medium">{selectedReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Date:</span>
                    <span className="font-mono text-stone-900">{new Date(selectedReceipt.date).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Item:</span>
                    <span className="text-stone-900 font-semibold">{selectedReceipt.bookTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Payment:</span>
                    <span>{selectedReceipt.paymentMethod}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
                    <span>Total Paid:</span>
                    <span className="font-mono text-[#0D5EAF]">${selectedReceipt.amountUSD.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Receipt ${selectedReceipt.receiptNumber} downloaded (Simulated PDF).`);
                    setSelectedReceipt(null);
                  }}
                  className="w-full py-2.5 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Receipt</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. READER PROFILE & ID TAB */}
      {activeTab === 'profile' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Logged-in Reader Profile & ID
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage your credentials, reading preferences, and security settings
              </p>
            </div>

            {onOpenProfileModal && (
              <button
                onClick={onOpenProfileModal}
                className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                Open Full Profile Card
              </button>
            )}
          </div>

          {/* Persona Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${profile.avatarColor} text-white flex items-center justify-center text-xl font-serif font-bold shadow-sm`}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-bold text-stone-900">{profile.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[#0D5EAF] text-[10px] font-mono font-bold border border-sky-200">
                      {profile.userId}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">{profile.handle} · {profile.status}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-stone-400 block font-mono">Wallet Credits</span>
                <span className="text-xl font-bold font-mono text-emerald-600">${profile.walletBalanceUSD?.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium block">Email Address</span>
                <span className="font-semibold text-stone-900 mt-1 block truncate">{profile.email}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium block">Location</span>
                <span className="font-semibold text-stone-900 mt-1 block">{profile.city}, {profile.country}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium block">Active Subscription</span>
                <span className="font-semibold text-[#0D5EAF] mt-1 block">{profile.subscriptionTier}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-stone-200">
              <span className="text-xs font-semibold text-stone-900 uppercase font-mono block mb-1">
                Reader Bio
              </span>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {profile.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200">
                <span className="text-xs font-semibold text-stone-900 uppercase font-mono block mb-2">
                  Configured Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferredLanguages.map((lang, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#0D5EAF] text-xs font-medium border border-sky-100">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200">
                <span className="text-xs font-semibold text-stone-900 uppercase font-mono block mb-2">
                  Favorite Genres
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.readingInterests?.map((genre, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-medium border border-amber-100">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
