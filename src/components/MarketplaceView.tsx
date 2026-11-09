import React, { useState } from 'react';
import { Book, StorySoundMood } from '../types';
import { Search, Filter, Star, Heart, Volume2, Sparkles, Tag, Globe, ArrowRight, BookOpen } from 'lucide-react';

interface MarketplaceViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  favorites: string[];
  onToggleFavorite: (bookId: string) => void;
  userPurchasedBookIds: string[];
  onPreviewStorySound: (mood: StorySoundMood) => void;
  onOpenReader: (bookId: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  books,
  onSelectBook,
  favorites,
  onToggleFavorite,
  userPurchasedBookIds,
  onPreviewStorySound,
  onOpenReader
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [filterPricing, setFilterPricing] = useState<'all' | 'launch_special'>('all');

  const genres = ['All', 'Literary Fiction', 'Sci-Fi & Speculative', 'Mystery & Thriller', 'Philosophy & Essays'];
  const languages = ['All', 'English', 'French', 'Japanese', 'Spanish', 'German'];

  // Filter books
  const filteredBooks = books.filter(book => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.publisherName.toLowerCase().includes(q) ||
      book.description.toLowerCase().includes(q) ||
      book.genre.toLowerCase().includes(q);

    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;

    const matchesLang =
      selectedLanguage === 'All' ||
      book.originalLanguage === selectedLanguage ||
      book.availableEditions.some(e => e.language === selectedLanguage);

    const releaseTime = new Date(book.releaseDate).getTime();
    const daysSinceRelease = (Date.now() - releaseTime) / (1000 * 60 * 60 * 24);
    const isLaunch = daysSinceRelease <= (book.promotionalPeriodDays || 7);
    const matchesPrice = filterPricing === 'all' || (filterPricing === 'launch_special' && isLaunch);

    return matchesSearch && matchesGenre && matchesLang && matchesPrice;
  });

  const featuredBook = books.find(b => b.featured) || books[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Hero Banner — Aegean White & Greek Blue */}
      <section className="relative rounded-3xl overflow-hidden border border-sky-100 bg-white shadow-lg">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_reading_ambience_1794218149076.jpg"
            alt="Novelia reading ambience"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-sky-50/70" />
        </div>

        <div className="relative z-10 p-5 sm:p-10 md:p-16 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0D5EAF] text-xs font-semibold uppercase tracking-wider font-mono">
            <Globe className="w-3.5 h-3.5" />
            <span>Multilingual Literature Marketplace</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight mt-3 sm:mt-4 leading-tight text-balance">
            Every story deserves to be heard, read, and felt.
          </h1>

          <p className="text-xs sm:text-base text-slate-600 mt-3 sm:mt-4 leading-relaxed font-sans max-w-2xl">
            Discover authorized global literature accompanied by <strong className="text-[#0D5EAF] font-semibold">StorySound™</strong> instrumental audio, chapter-based <strong className="text-[#0D5EAF] font-semibold">Chapter Circle™</strong> community reflections, and our <strong className="text-[#0D5EAF] font-semibold">ROX AI</strong> assistant.
          </p>

          {/* Quick launch special spotlight callout */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectBook(featuredBook)}
              className="px-6 py-3 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              <span>Explore Featured: “{featuredBook.title}”</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPreviewStorySound('reflective')}
              className="px-4 py-3 bg-white hover:bg-sky-50 text-[#0D5EAF] border border-sky-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-[#0D5EAF]" />
              <span>Preview StorySound™ Ambience</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-mono">
            <span className="text-[#0D5EAF] font-semibold">✨ 7-Day Launch Special: $2.00</span>
            <span>·</span>
            <span>📚 Authorized Editions</span>
            <span>·</span>
            <span>🎧 Non-Lyrical Soundtracks</span>
          </div>
        </div>
      </section>

      {/* Discovery Filters & Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, publisher, keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D5EAF] focus:ring-2 focus:ring-sky-100 transition-all shadow-xs"
            />
          </div>

          {/* Pricing filter segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
            <button
              onClick={() => setFilterPricing('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterPricing === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Releases
            </button>
            <button
              onClick={() => setFilterPricing('launch_special')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                filterPricing === 'launch_special'
                  ? 'bg-[#0D5EAF] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>Launch Specials ($2.00)</span>
            </button>
          </div>
        </div>

        {/* Category & Language Filter Bars */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Genre Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs text-slate-500 font-mono mr-1">Genre:</span>
            {genres.map(genre => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D5EAF] text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#0D5EAF]" />
            <span className="text-slate-500 font-mono">Language:</span>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0D5EAF] cursor-pointer shadow-xs"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Book Catalog Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Curated Literature & Authorized Editions
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Showing {filteredBooks.length} titles
          </span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 border border-slate-200 rounded-2xl bg-white shadow-xs">
            <p className="text-slate-600 text-sm">No books found matching your active filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setFilterPricing('all');
              }}
              className="mt-3 px-4 py-2 bg-[#0D5EAF] text-white text-xs font-medium rounded-xl hover:bg-[#094787] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => {
              const isFavorite = favorites.includes(book.id);
              const isOwned = userPurchasedBookIds.includes(book.id);

              const releaseTime = new Date(book.releaseDate).getTime();
              const daysSinceRelease = (Date.now() - releaseTime) / (1000 * 60 * 60 * 24);
              const isLaunch = daysSinceRelease <= (book.promotionalPeriodDays || 7);
              const activePrice = isLaunch ? book.launchPriceUSD : book.regularPriceUSD;

              return (
                <div
                  key={book.id}
                  className="group flex flex-col justify-between bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-sky-300 transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-lg"
                >
                  {/* Book Cover Image container */}
                  <div
                    onClick={() => onSelectBook(book)}
                    className="relative aspect-[3/4] bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />

                    {/* Launch pricing badge (Greek Blue per styling request) */}
                    {isLaunch && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#0D5EAF] text-white text-[10px] font-bold shadow-sm">
                        Launch Special: ${book.launchPriceUSD.toFixed(2)}
                      </div>
                    )}

                    {isOwned && (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                        In Library
                      </div>
                    )}

                    {/* Quick favorite heart button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite(book.id);
                      }}
                      className={`absolute bottom-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                        isFavorite
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Quiet unboxed metadata per Frontend Design Constitution */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                        <span className="text-[#0D5EAF] font-medium">{book.genre}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.originalLanguage}</span>
                      </div>

                      <h3
                        onClick={() => onSelectBook(book)}
                        className="text-base font-serif font-bold text-slate-900 group-hover:text-[#0D5EAF] transition-colors mt-1.5 line-clamp-1 cursor-pointer"
                      >
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        By {book.author}
                      </p>

                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed font-sans">
                        {book.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-mono font-bold text-[#0D5EAF]">
                            ${activePrice.toFixed(2)}
                          </span>
                          {isLaunch && (
                            <span className="text-xs font-mono line-through text-slate-400">
                              ${book.regularPriceUSD.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {book.availableEditions.length} editions
                        </span>
                      </div>

                      {isOwned ? (
                        <button
                          onClick={() => onOpenReader(book.id)}
                          className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0D5EAF] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-sky-200"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#0D5EAF]" />
                          <span>Read</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectBook(book)}
                          className="px-3 py-1.5 bg-[#0D5EAF] hover:bg-[#094787] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
