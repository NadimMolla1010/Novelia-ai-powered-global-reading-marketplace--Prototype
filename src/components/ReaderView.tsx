import React, { useState, useEffect } from 'react';
import { Book, Chapter, StorySoundMood } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  Bookmark,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Check,
  Globe,
  Sliders,
  Star
} from 'lucide-react';
import { READING_LANGUAGES, getLocalizedChapter, ReadingLanguage } from '../data/translations';

interface ReaderViewProps {
  book: Book;
  onExit: () => void;
  onUpdateProgress: (bookId: string, chapterId: string, percent: number) => void;
  onOpenChapterCircle: (chapterNumber: number) => void;
  isStorySoundActive: boolean;
  onToggleStorySound: () => void;
  currentSoundMood: StorySoundMood;
  onChangeSoundMood: (mood: StorySoundMood) => void;
  userPreferredLanguages?: string[];
}

type ReaderTheme = 'paper' | 'sepia' | 'dark';
type ReaderFont = 'serif' | 'sans';

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  onExit,
  onUpdateProgress,
  onOpenChapterCircle,
  isStorySoundActive,
  onToggleStorySound,
  currentSoundMood,
  onChangeSoundMood,
  userPreferredLanguages = ['English', 'Ukrainian', 'German', 'Spanish', 'French']
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<ReaderTheme>('paper'); // Default to Cycladic white
  const [fontFamily, setFontFamily] = useState<ReaderFont>('serif');
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isMobileAppearanceOpen, setIsMobileAppearanceOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected language state (defaults to stored language or 'en')
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(() => {
    return localStorage.getItem('novelia_reader_lang') || 'en';
  });

  const currentChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  useEffect(() => {
    const completionPercent = Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100);
    onUpdateProgress(book.id, currentChapter.id, completionPercent);

    if (currentChapter.audioTrack?.mood && currentChapter.audioTrack.mood !== currentSoundMood) {
      onChangeSoundMood(currentChapter.audioTrack.mood);
    }
  }, [currentChapterIndex, book.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentChapter.number)) {
      setBookmarks(bookmarks.filter(n => n !== currentChapter.number));
      showToast(`Removed bookmark for Chapter ${currentChapter.number}`);
    } else {
      setBookmarks([...bookmarks, currentChapter.number]);
      showToast(`Chapter ${currentChapter.number} bookmarked`);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onOpenChapterCircle(currentChapter.number);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectLanguage = (lang: ReadingLanguage) => {
    setSelectedLanguageCode(lang.code);
    localStorage.setItem('novelia_reader_lang', lang.code);
    setIsLanguageModalOpen(false);
    showToast(`Book text switched to ${lang.name} edition`);
  };

  // Get active translated text for the chapter
  const localizedData = getLocalizedChapter(
    book.id,
    currentChapter.number,
    selectedLanguageCode,
    currentChapter.title,
    currentChapter.content
  );

  const activeLangObj = READING_LANGUAGES.find(l => l.code === selectedLanguageCode) || READING_LANGUAGES[0];

  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#faf7f0] text-[#2c241c] border-[#e8ded0]';
      case 'dark':
        return 'bg-[#06182c] text-[#e0f2fe] border-[#0c2a4d]';
      case 'paper':
      default:
        return 'bg-white text-slate-900 border-slate-200';
    }
  };

  const getHeaderClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f0ebe0]/95 border-[#dec8b0] text-[#2c241c]';
      case 'dark':
        return 'bg-[#06182c]/95 border-[#0c2a4d] text-[#e0f2fe]';
      case 'paper':
      default:
        return 'bg-white/95 border-slate-200 text-slate-900';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 overflow-x-hidden ${getThemeClasses()}`}>
      {/* Reader Fixed Top Controls */}
      <header className={`sticky top-0 z-40 border-b px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4 backdrop-blur-md shadow-2xs ${getHeaderClasses()}`}>
        {/* Left: Exit button & Table of Contents Drawer Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onExit}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-500/10 text-xs font-semibold text-[#0D5EAF] transition-colors cursor-pointer"
            title="Return to Marketplace"
          >
            <ArrowLeft className="w-4 h-4 text-[#0D5EAF]" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <span className="opacity-30 text-xs hidden sm:inline">|</span>

          <button
            onClick={() => setIsChapterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-500/10 text-xs font-medium transition-colors cursor-pointer"
            title="Open Table of Contents"
          >
            <Menu className="w-4 h-4 text-[#0D5EAF]" />
            <span className="hidden md:inline truncate max-w-[130px]">
              Ch. {currentChapter.number}: {currentChapter.title}
            </span>
            <span className="md:hidden font-mono font-medium">Ch. {currentChapter.number}</span>
          </button>
        </div>

        {/* Center: Book Title (Desktop only) */}
        <div className="hidden lg:block text-center truncate max-w-sm px-2">
          <span className="text-xs font-serif italic opacity-60">Reading:</span>{' '}
          <span className="text-xs font-semibold text-[#0D5EAF]">{book.title}</span>
        </div>

        {/* Right: Language Switcher, StorySound, Mobile Style Trigger, Desktop Appearance */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Language Switcher Button (PRD Multilingual Requirement) */}
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100/90 text-xs font-medium text-[#0D5EAF] transition-all cursor-pointer shadow-2xs"
            title={`Reading in ${activeLangObj.name}. Click to change language.`}
          >
            <Globe className="w-3.5 h-3.5 text-[#0D5EAF] shrink-0" />
            <span className="font-semibold text-[11px] truncate max-w-[70px] sm:max-w-none">
              {activeLangObj.flag} {activeLangObj.name}
            </span>
          </button>

          {/* 2. StorySound Quick Toggle */}
          <button
            onClick={onToggleStorySound}
            title={isStorySoundActive ? "Pause StorySound" : "Play StorySound"}
            className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1 cursor-pointer ${
              isStorySoundActive
                ? 'bg-sky-50 border-sky-300 text-[#0D5EAF]'
                : 'border-slate-300/60 opacity-80 hover:opacity-100'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isStorySoundActive ? 'animate-pulse text-[#0D5EAF]' : ''}`} />
            <span className="hidden xl:inline text-[11px] font-mono font-medium">Sound</span>
          </button>

          {/* 3. Mobile Appearance Menu Button (< md screens) */}
          <button
            onClick={() => setIsMobileAppearanceOpen(!isMobileAppearanceOpen)}
            className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
              isMobileAppearanceOpen
                ? 'bg-[#0D5EAF] text-white border-[#0D5EAF]'
                : 'border-slate-300/60 opacity-80 hover:opacity-100'
            }`}
            title="Reading display settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* 4. Desktop-only Appearance & Typography Toolbar (≥ md screens) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Chapter Circle Discussion Trigger */}
            <button
              onClick={() => onOpenChapterCircle(currentChapter.number)}
              className="p-2 rounded-xl border border-slate-300/60 hover:border-sky-300 hover:text-[#0D5EAF] transition-colors flex items-center gap-1 cursor-pointer"
              title="Open Chapter Circle discussion"
            >
              <MessageSquare className="w-4 h-4 text-[#0D5EAF]" />
              <span className="hidden xl:inline text-[11px] font-medium">Discussion</span>
            </button>

            {/* Bookmark toggle */}
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                bookmarks.includes(currentChapter.number)
                  ? 'bg-sky-50 border-sky-300 text-[#0D5EAF]'
                  : 'border-slate-300/60 opacity-80 hover:opacity-100'
              }`}
              title="Bookmark this chapter"
            >
              <Bookmark className={`w-4 h-4 ${bookmarks.includes(currentChapter.number) ? 'fill-current text-[#0D5EAF]' : ''}`} />
            </button>

            {/* Font Size & Serif Toggle */}
            <div className="flex items-center border border-slate-300/60 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-2 py-1 text-xs hover:bg-slate-500/10 rounded-lg font-mono cursor-pointer"
                title="Decrease text size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                className="px-2 py-1 text-xs hover:bg-slate-500/10 rounded-lg font-mono font-bold cursor-pointer"
                title="Increase text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontFamily(prev => (prev === 'serif' ? 'sans' : 'serif'))}
                className="px-2 py-1 text-xs hover:bg-slate-500/10 rounded-lg font-medium text-[#0D5EAF] cursor-pointer"
                title="Toggle Serif / Sans"
              >
                {fontFamily === 'serif' ? 'Serif' : 'Sans'}
              </button>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center border border-slate-300/60 rounded-xl p-0.5">
              <button
                onClick={() => setTheme('paper')}
                className={`p-1.5 rounded-lg cursor-pointer ${theme === 'paper' ? 'bg-[#0D5EAF] text-white' : 'opacity-60 hover:opacity-100'}`}
                title="Cycladic White Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded-lg cursor-pointer ${theme === 'sepia' ? 'bg-[#e2d8c3] text-[#2c241c] font-bold' : 'opacity-60 hover:opacity-100'}`}
                title="Warm Marble Theme"
              >
                <span className="text-xs font-serif font-bold">M</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg cursor-pointer ${theme === 'dark' ? 'bg-[#0D5EAF] text-white' : 'opacity-60 hover:opacity-100'}`}
                title="Aegean Midnight Blue Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Appearance Drawer / Dropdown (< md screens) */}
      {isMobileAppearanceOpen && (
        <div className="md:hidden border-b border-stone-200/80 bg-white/95 px-4 py-3 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2 text-stone-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0D5EAF] font-bold">
              Typography & Theme
            </span>
            <button
              onClick={() => setIsMobileAppearanceOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Font Size controls */}
            <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-stone-50">
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-2.5 py-1 text-xs font-mono rounded-lg hover:bg-white cursor-pointer"
              >
                A-
              </button>
              <span className="px-2 text-xs font-mono font-bold text-[#0D5EAF]">{fontSize}px</span>
              <button
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg hover:bg-white cursor-pointer"
              >
                A+
              </button>
            </div>

            {/* Font Family Toggle */}
            <button
              onClick={() => setFontFamily(prev => (prev === 'serif' ? 'sans' : 'serif'))}
              className="px-3 py-1.5 text-xs font-medium border border-stone-200 rounded-xl bg-stone-50 text-[#0D5EAF] cursor-pointer"
            >
              Font: {fontFamily === 'serif' ? 'Serif' : 'Sans'}
            </button>

            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl border text-xs cursor-pointer ${
                bookmarks.includes(currentChapter.number)
                  ? 'bg-sky-50 border-sky-300 text-[#0D5EAF]'
                  : 'border-stone-200 text-stone-600'
              }`}
              title="Bookmark chapter"
            >
              <Bookmark className={`w-4 h-4 ${bookmarks.includes(currentChapter.number) ? 'fill-current text-[#0D5EAF]' : ''}`} />
            </button>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
            <span className="text-xs text-stone-500 font-medium">Theme:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme('paper')}
                className={`px-3 py-1 text-xs rounded-xl border cursor-pointer ${
                  theme === 'paper' ? 'bg-[#0D5EAF] text-white border-[#0D5EAF] font-bold' : 'border-stone-200 text-stone-700'
                }`}
              >
                White
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-3 py-1 text-xs rounded-xl border cursor-pointer ${
                  theme === 'sepia' ? 'bg-[#dec8b0] text-[#2c241c] border-[#dec8b0] font-bold' : 'border-stone-200 text-stone-700'
                }`}
              >
                Marble
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 text-xs rounded-xl border cursor-pointer ${
                  theme === 'dark' ? 'bg-[#06182c] text-white border-[#06182c] font-bold' : 'border-stone-200 text-stone-700'
                }`}
              >
                Midnight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-18 right-4 sm:right-6 z-50 bg-[#0D5EAF] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <Check className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Reading Flow - Adaptive Width & Responsive Spacing */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16 w-full">
        {/* Chapter Header */}
        <div className="text-center mb-8 sm:mb-12 pb-6 border-b border-slate-300/40">
          {/* Multilingual Edition Badge */}
          {localizedData.isTranslated && (
            <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs text-[#0D5EAF] font-medium font-sans animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                Authorized {activeLangObj.name} Translation
                {localizedData.translatorName ? ` by ${localizedData.translatorName}` : ''}
              </span>
            </div>
          )}

          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-mono text-[#0D5EAF] font-bold">
              Chapter {currentChapter.number} of {book.chapters.length}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mt-2 tracking-tight break-words">
            {localizedData.title}
          </h1>

          {/* Audio Mood tag */}
          {currentChapter.audioTrack && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs opacity-75 font-mono">
              <Volume2 className="w-3.5 h-3.5 text-[#0D5EAF]" />
              <span className="truncate max-w-[280px] sm:max-w-none">
                StorySound: {currentChapter.audioTrack.title} ({currentChapter.audioTrack.tempo})
              </span>
            </div>
          )}
        </div>

        {/* Chapter Prose Content */}
        <article
          className={`space-y-6 leading-relaxed transition-all ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
        >
          {localizedData.paragraphs.map((paragraph, idx) => (
            <p key={idx} className="indent-5 sm:indent-7 first:indent-0 break-words">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Chapter Completion Prompt Banner */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-slate-300/40 text-center">
          <div className="p-5 sm:p-6 rounded-3xl bg-sky-50/80 border border-sky-200 max-w-lg mx-auto shadow-xs text-stone-900">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0D5EAF] font-bold block">
              Chapter {currentChapter.number} Complete
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold mt-1 text-slate-900">
              “Share your feelings till now before the break....”
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Join fellow readers in the Chapter Circle without spoiling upcoming chapters.
            </p>

            <button
              onClick={() => onOpenChapterCircle(currentChapter.number)}
              className="mt-4 px-4 sm:px-5 py-2.5 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Chapter Circle Discussion</span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation (Prev / Next Chapter) - Responsive */}
        <div className="mt-10 sm:mt-12 flex items-center justify-between gap-2 pt-6 border-t border-slate-300/40">
          <button
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border border-slate-300/60 text-xs font-medium disabled:opacity-30 disabled:hover:bg-transparent hover:bg-slate-500/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Chapter</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <span className="text-xs font-mono opacity-70 whitespace-nowrap">
            {currentChapterIndex + 1} / {book.chapters.length}
          </span>

          <button
            onClick={handleNextChapter}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl bg-[#0D5EAF] text-white font-bold text-xs hover:bg-[#094787] transition-colors cursor-pointer shadow-md shadow-blue-500/20"
          >
            <span className="hidden sm:inline">
              {currentChapterIndex === book.chapters.length - 1 ? 'Finish Book' : 'Next Chapter'}
            </span>
            <span className="sm:hidden">
              {currentChapterIndex === book.chapters.length - 1 ? 'Finish' : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* MODAL: LANGUAGE SELECTION MODAL */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-stone-900 animate-in zoom-in-95">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 to-sky-50/80">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0D5EAF]" />
                <span className="font-serif font-bold text-sm text-stone-900">
                  Select Reading Language Edition
                </span>
              </div>
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose an authorized publisher edition. Text updates instantly while preserving formatting and StorySound accompaniment.
              </p>

              {/* User Preferred Languages Banner */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900">
                <span className="font-bold flex items-center gap-1.5 text-amber-800 mb-1">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  Your Profile Preferred Languages:
                </span>
                <span className="text-[11px] font-medium text-amber-700">
                  {userPreferredLanguages.join(' · ')}
                </span>
              </div>

              {/* Language List */}
              <div className="space-y-2">
                {READING_LANGUAGES.map(lang => {
                  const isSelected = selectedLanguageCode === lang.code;
                  const isPreferred = userPreferredLanguages.some(
                    pl => pl.toLowerCase() === lang.name.toLowerCase()
                  );

                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-50 border-[#0D5EAF] text-[#0D5EAF] ring-2 ring-sky-200 shadow-xs'
                          : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{lang.localName}</span>
                            {isPreferred && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-current text-amber-600" />
                                Preferred
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 block truncate mt-0.5">
                            {lang.isOriginal ? 'Original Manuscript' : `Authorized Translation by ${lang.translator}`}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#0D5EAF] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-stone-400">Select</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-stone-100 bg-[#fcfaf5] text-right">
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="px-4 py-2 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Drawer / Table of Contents - Mobile Adapted */}
      {isChapterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-[88vw] max-w-sm sm:w-96 bg-white border-r border-slate-200 h-full p-4 sm:p-6 flex flex-col shadow-2xl text-stone-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm font-serif font-bold text-slate-900">
                Table of Contents
              </span>
              <button
                onClick={() => setIsChapterDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-2">
              {book.chapters.map((ch, idx) => {
                const isCurrent = idx === currentChapterIndex;
                const isBookmarked = bookmarks.includes(ch.number);
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setIsChapterDrawerOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-sky-50 border-[#0D5EAF] text-[#0D5EAF] font-semibold ring-1 ring-sky-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Chapter {ch.number}
                      </span>
                      {isBookmarked && (
                        <Bookmark className="w-3.5 h-3.5 text-[#0D5EAF] fill-current" />
                      )}
                    </div>
                    <p className="text-xs mt-1 text-slate-900 font-medium truncate">{ch.title}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {ch.readTimeMinutes} min read · {ch.audioTrack?.mood} mood
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Reading progress saved automatically.
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsChapterDrawerOpen(false)} />
        </div>
      )}
    </div>
  );
};
