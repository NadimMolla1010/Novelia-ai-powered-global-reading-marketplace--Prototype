import React, { useState } from 'react';
import { Book, BookEdition } from '../types';
import { Heart, Volume2, Star, Globe, Clock, ShieldCheck, Tag, X, BookOpen, ShoppingCart, MessageSquare } from 'lucide-react';

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  isOwned: boolean;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
  onOpenCheckout: (book: Book, edition: BookEdition) => void;
  onStartReading: (bookId: string) => void;
  onPreviewStorySound: (mood: any) => void;
  onOpenChapterCircle: (chapterNumber: number) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  isOpen,
  onClose,
  book,
  isOwned,
  isFavorite,
  onToggleFavorite,
  onOpenCheckout,
  onStartReading,
  onPreviewStorySound,
  onOpenChapterCircle
}) => {
  const [selectedEdition, setSelectedEdition] = useState<BookEdition>(
    book.availableEditions[0]
  );

  if (!isOpen) return null;

  const releaseTime = new Date(book.releaseDate).getTime();
  const now = Date.now();
  const daysSinceRelease = (now - releaseTime) / (1000 * 60 * 60 * 24);
  const isLaunchWindow = daysSinceRelease <= (book.promotionalPeriodDays || 7);
  const currentPrice = isLaunchWindow ? book.launchPriceUSD : book.regularPriceUSD;
  const daysLeft = Math.max(1, Math.ceil(book.promotionalPeriodDays - daysSinceRelease));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono text-[#0D5EAF] font-semibold">{book.genre}</span>
            <span>·</span>
            <span>Published by {book.publisherName}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-12 gap-6">
          {/* Left Column: Cover & Quick Actions */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-[240px]">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-xl border border-slate-200 bg-slate-100"
              />
              {isLaunchWindow && (
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#0D5EAF] text-white text-[11px] font-bold rounded-lg shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Launch Special: ${book.launchPriceUSD.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* StorySound Chapter Audio Preview */}
            <button
              onClick={() => onPreviewStorySound(book.audioMood)}
              className="mt-4 w-full max-w-[240px] py-2 px-3 rounded-xl bg-sky-50 border border-sky-200 hover:bg-sky-100 text-[#0D5EAF] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Volume2 className="w-4 h-4 text-[#0D5EAF] group-hover:scale-110 transition-transform" />
              <span>Preview StorySound™ ({book.audioMood})</span>
            </button>

            {/* Chapter Circle Discussion Preview */}
            <button
              onClick={() => onOpenChapterCircle(1)}
              className="mt-2 w-full max-w-[240px] py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#0D5EAF]" />
              <span>Chapter Circle (34 Reflections)</span>
            </button>
          </div>

          {/* Right Column: Book Details & Purchase module */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">
                    {book.title}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 italic font-serif">
                    {book.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => onToggleFavorite(book.id)}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Author and Rating */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600">
                <span>By <strong className="text-slate-900">{book.author}</strong></span>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold text-slate-900">{book.rating.toFixed(2)}</span>
                  <span className="text-slate-500 text-[11px]">({book.reviewCount} ratings)</span>
                </div>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">{book.totalPages} pages</span>
              </div>

              {/* Synopsis */}
              <p className="text-xs text-slate-600 mt-4 leading-relaxed font-sans">
                {book.description}
              </p>

              {/* Authorized Language Editions picker */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    Authorized Language Editions:
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Publisher Approved
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {book.availableEditions.map(edition => {
                    const isSelected = selectedEdition.languageCode === edition.languageCode;
                    return (
                      <button
                        key={edition.languageCode}
                        onClick={() => setSelectedEdition(edition)}
                        className={`p-2 rounded-xl text-left text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 border-[#0D5EAF] text-[#0D5EAF] font-medium ring-1 ring-[#0D5EAF]/20'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>{edition.language}</span>
                          {edition.isOriginal && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                              ORIGINAL
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                          {edition.translator ? `Trans. ${edition.translator}` : 'Original text'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky/Bottom Purchase & Read Action Block */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-[#0D5EAF]">
                      ${currentPrice.toFixed(2)} USD
                    </span>
                    {isLaunchWindow && (
                      <span className="text-xs line-through text-slate-400 font-mono">
                        ${book.regularPriceUSD.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {isLaunchWindow && (
                    <span className="text-[11px] text-[#0D5EAF] font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Launch promotion expires in {daysLeft} days
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Selected Edition:</span>
                  <span className="text-xs font-semibold text-slate-900">
                    {selectedEdition.language}
                  </span>
                </div>
              </div>

              {isOwned ? (
                <button
                  onClick={() => {
                    onClose();
                    onStartReading(book.id);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Already in My Library — Start Reading</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onStartReading(book.id);
                    }}
                    className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                  >
                    <BookOpen className="w-4 h-4 text-[#0D5EAF]" />
                    <span>Free Preview (Ch. 1)</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenCheckout(book, selectedEdition);
                    }}
                    className="flex-1 py-3 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Purchase Book (${currentPrice.toFixed(2)})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
