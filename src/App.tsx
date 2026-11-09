/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Book,
  BookEdition,
  PublisherAccount,
  CampaignRequest,
  ChapterComment,
  Transaction,
  NoveliaNotification,
  StorySoundMood,
  ReaderProgress,
  UserProfile
} from './types';
import {
  INITIAL_BOOKS,
  INITIAL_PUBLISHERS,
  INITIAL_CAMPAIGNS,
  INITIAL_CHAPTER_COMMENTS,
  INITIAL_USER_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  PERSONA_PROFILES
} from './data/initialData';
import { soundEngine } from './services/soundEngine';

import { DemoHeader } from './components/DemoHeader';
import { TopNav } from './components/TopNav';
import { MarketplaceView } from './components/MarketplaceView';
import { BookDetailModal } from './components/BookDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReaderView } from './components/ReaderView';
import { ChapterCircleModal } from './components/ChapterCircleModal';
import { ReaderDashboard } from './components/ReaderDashboard';
import { PublisherPortal } from './components/PublisherPortal';
import { AdminPortal } from './components/AdminPortal';
import { RoxAssistant } from './components/RoxAssistant';
import { StorySoundBar } from './components/StorySoundBar';
import { UserProfileModal } from './components/UserProfileModal';

export default function App() {
  // 1. Core Role State
  const [currentRole, setCurrentRole] = useState<UserRole>('reader');
  const [activeTab, setActiveTab] = useState<string>('discover');

  // User Profiles across personas
  const [userProfiles, setUserProfiles] = useState<Record<UserRole, UserProfile>>(() => {
    const saved = localStorage.getItem('novelia_profiles');
    return saved ? JSON.parse(saved) : PERSONA_PROFILES;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const currentProfile = userProfiles[currentRole];

  // 2. Data State (Stored in localStorage or initial fallbacks)
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('novelia_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [publishers, setPublishers] = useState<PublisherAccount[]>(() => {
    const saved = localStorage.getItem('novelia_publishers');
    return saved ? JSON.parse(saved) : INITIAL_PUBLISHERS;
  });

  const [campaigns, setCampaigns] = useState<CampaignRequest[]>(() => {
    const saved = localStorage.getItem('novelia_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [comments, setComments] = useState<ChapterComment[]>(() => {
    const saved = localStorage.getItem('novelia_comments');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTER_COMMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('novelia_transactions');
    return saved ? JSON.parse(saved) : INITIAL_USER_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NoveliaNotification[]>(() => {
    const saved = localStorage.getItem('novelia_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [userPurchasedBookIds, setUserPurchasedBookIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('novelia_user_purchases');
    return saved ? JSON.parse(saved) : ['book-solitude'];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('novelia_favorites');
    return saved ? JSON.parse(saved) : ['book-gate', 'book-whispers'];
  });

  const [readingProgress, setReadingProgress] = useState<Record<string, ReaderProgress>>(() => {
    const saved = localStorage.getItem('novelia_reading_progress');
    return saved
      ? JSON.parse(saved)
      : {
          'book-solitude': {
            bookId: 'book-solitude',
            currentChapterId: 'solitude-ch-1',
            lastReadDate: new Date().toISOString(),
            completionPercentage: 35,
            bookmarks: [1],
            highlights: []
          }
        };
  });

  // 3. Audio & Reader State
  const [isStorySoundActive, setIsStorySoundActive] = useState<boolean>(false);
  const [currentSoundMood, setCurrentSoundMood] = useState<StorySoundMood>('reflective');
  const [activeReadingBookId, setActiveReadingBookId] = useState<string | null>(null);

  // 4. Modals State
  const [selectedDetailBook, setSelectedDetailBook] = useState<Book | null>(null);
  const [checkoutBookData, setCheckoutBookData] = useState<{ book: Book; edition: BookEdition } | null>(null);
  const [chapterCircleState, setChapterCircleState] = useState<{
    isOpen: boolean;
    chapterNumber: number;
    bookId?: string;
  }>({ isOpen: false, chapterNumber: 1 });
  const [isRoxOpen, setIsRoxOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('novelia_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('novelia_publishers', JSON.stringify(publishers));
  }, [publishers]);

  useEffect(() => {
    localStorage.setItem('novelia_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('novelia_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('novelia_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('novelia_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('novelia_user_purchases', JSON.stringify(userPurchasedBookIds));
  }, [userPurchasedBookIds]);

  useEffect(() => {
    localStorage.setItem('novelia_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('novelia_reading_progress', JSON.stringify(readingProgress));
  }, [readingProgress]);

  useEffect(() => {
    localStorage.setItem('novelia_profiles', JSON.stringify(userProfiles));
  }, [userProfiles]);

  const handleUpdateBio = (newBio: string) => {
    setUserProfiles(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        bio: newBio
      }
    }));
  };

  // StorySound toggle handler
  const handleToggleStorySound = () => {
    if (isStorySoundActive) {
      soundEngine.stop();
      setIsStorySoundActive(false);
    } else {
      soundEngine.startMood(currentSoundMood);
      setIsStorySoundActive(true);
    }
  };

  const handleChangeSoundMood = (mood: StorySoundMood) => {
    setCurrentSoundMood(mood);
    if (isStorySoundActive) {
      soundEngine.startMood(mood);
    }
  };

  const handlePreviewStorySound = (mood: StorySoundMood) => {
    setCurrentSoundMood(mood);
    soundEngine.startMood(mood);
    setIsStorySoundActive(true);
  };

  // Reset demo data
  const handleResetDemoData = () => {
    if (confirm('Reset prototype to initial catalog and transactions?')) {
      localStorage.clear();
      setBooks(INITIAL_BOOKS);
      setPublishers(INITIAL_PUBLISHERS);
      setCampaigns(INITIAL_CAMPAIGNS);
      setComments(INITIAL_CHAPTER_COMMENTS);
      setTransactions(INITIAL_USER_TRANSACTIONS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setUserPurchasedBookIds(['book-solitude']);
      setFavorites(['book-gate', 'book-whispers']);
      setUserProfiles(PERSONA_PROFILES);
      soundEngine.stop();
      setIsStorySoundActive(false);
    }
  };

  // Switch role helper
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'admin' && isStorySoundActive) {
      soundEngine.stop();
      setIsStorySoundActive(false);
    }
    if (role === 'reader') setActiveTab('discover');
    if (role === 'publisher') setActiveTab('pub-overview');
    if (role === 'admin') setActiveTab('admin-overview');
  };

  // Favorites toggle
  const handleToggleFavorite = (bookId: string) => {
    setFavorites(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  // Purchase confirmation (Simulated Checkout)
  const handleConfirmPurchase = (book: Book, edition: BookEdition) => {
    const releaseTime = new Date(book.releaseDate).getTime();
    const daysSinceRelease = (Date.now() - releaseTime) / (1000 * 60 * 60 * 24);
    const isLaunch = daysSinceRelease <= (book.promotionalPeriodDays || 7);
    const amount = isLaunch ? book.launchPriceUSD : book.regularPriceUSD;
    const commission = amount * 0.20;
    const publisherShare = amount - commission;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'book_purchase',
      bookId: book.id,
      bookTitle: book.title,
      amountUSD: amount,
      grossAmountUSD: amount,
      commissionAmountUSD: commission,
      publisherNetUSD: publisherShare,
      status: 'successful',
      date: new Date().toISOString(),
      receiptNumber: `NOV-REC-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentMethod: 'Simulated Visa •••• 4021',
      editionLanguage: `${edition.language} (${edition.type === 'publisher_approved' ? 'Approved' : 'Original'})`
    };

    setTransactions(prev => [newTx, ...prev]);

    if (!userPurchasedBookIds.includes(book.id)) {
      setUserPurchasedBookIds(prev => [...prev, book.id]);
    }

    // Increment units sold
    setBooks(prev =>
      prev.map(b =>
        b.id === book.id
          ? { ...b, unitsSold: (b.unitsSold || 0) + 1, activeReaders: (b.activeReaders || 0) + 1 }
          : b
      )
    );

    // Add in-app notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Purchase Successful',
        message: `“${book.title}” is now unlocked in My Library. Enjoy StorySound and Chapter Circle.`,
        date: 'Just now',
        type: 'purchase',
        read: false
      },
      ...prev
    ]);
  };

  // Reading progress update
  const handleUpdateProgress = (bookId: string, chapterId: string, percent: number) => {
    setReadingProgress(prev => ({
      ...prev,
      [bookId]: {
        bookId,
        currentChapterId: chapterId,
        lastReadDate: new Date().toISOString(),
        completionPercentage: percent,
        bookmarks: prev[bookId]?.bookmarks || [],
        highlights: prev[bookId]?.highlights || []
      }
    }));
  };

  // Chapter Circle comments
  const handleAddComment = (text: string) => {
    const targetBookId = activeReadingBookId || selectedDetailBook?.id || 'book-solitude';
    const newComment: ChapterComment = {
      id: `comm-${Date.now()}`,
      bookId: targetBookId,
      chapterNumber: chapterCircleState.chapterNumber,
      userName: currentRole === 'reader' ? 'Elena Rostova' : 'Marcus Sterling',
      userRole: currentRole === 'reader' ? 'Reader' : 'Publisher',
      avatarColor: 'bg-amber-600',
      text,
      timestamp: 'Just now',
      likes: 1,
      hasLiked: true,
      reported: false
    };

    setComments(prev => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? {
              ...c,
              likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
              hasLiked: !c.hasLiked
            }
          : c
      )
    );
  };

  const handleReportComment = (commentId: string) => {
    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, reported: true } : c))
    );
  };

  // Publisher Actions
  const handleAddNewBook = (newBookData: Partial<Book>) => {
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: newBookData.title || 'Untitled',
      subtitle: newBookData.subtitle || '',
      author: newBookData.author || 'Author',
      authorBio: 'Biographical profile on file with publisher.',
      publisherId: newBookData.publisherId || 'pub-horizon',
      publisherName: newBookData.publisherName || 'Horizon Global Publishing',
      genre: newBookData.genre || 'Literary Fiction',
      originalLanguage: newBookData.originalLanguage || 'English',
      availableEditions: [
        { language: newBookData.originalLanguage || 'English', languageCode: 'en', isOriginal: true, type: 'publisher_approved' }
      ],
      coverImage: newBookData.coverImage || '/src/assets/images/book_cover_solitude_1794218149274.jpg',
      releaseDate: new Date().toISOString(),
      launchPriceUSD: newBookData.launchPriceUSD || 2.00,
      regularPriceUSD: newBookData.regularPriceUSD || 4.00,
      promotionalPeriodDays: 7,
      description: newBookData.description || '',
      rating: 5.0,
      reviewCount: 0,
      totalPages: 240,
      featured: false,
      audioMood: newBookData.audioMood || 'reflective',
      status: 'under_review',
      unitsSold: 0,
      activeReaders: 0,
      completionRate: 0,
      chapters: [
        {
          id: `ch-${Date.now()}-1`,
          number: 1,
          title: 'Opening Movement',
          readTimeMinutes: 6,
          audioTrack: {
            id: `track-${Date.now()}`,
            title: 'Atmospheric Overture',
            mood: newBookData.audioMood || 'reflective',
            tempo: '60 BPM',
            description: 'Instrumental literature accompaniment'
          },
          summary: 'The initial chapter setting up the journey and characters.',
          keyEvents: ['Prologue setting', 'First dialogue', 'Inciting incident'],
          content: [
            'The city held its breath as autumn gave way to winter.',
            'Every word written in the margin of the ledger carried a weight far heavier than the ink that formed it.',
            'Here began the story that had waited twenty years to be spoken.'
          ]
        }
      ]
    };

    setBooks(prev => [newBook, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Book Submitted for Moderation',
        message: `“${newBook.title}” has been queued for administrative review.`,
        date: 'Just now',
        type: 'campaign',
        read: false
      },
      ...prev
    ]);
  };

  const handleSubmitCampaign = (newCampData: Partial<CampaignRequest>) => {
    const newCamp: CampaignRequest = {
      id: `camp-${Date.now()}`,
      publisherId: newCampData.publisherId || 'pub-horizon',
      publisherName: newCampData.publisherName || 'Horizon Global Publishing',
      bookId: newCampData.bookId || 'book-solitude',
      bookTitle: newCampData.bookTitle || 'The Architecture of Solitude',
      campaignType: newCampData.campaignType || 'New Release Spotlight',
      targetRegion: newCampData.targetRegion || 'Global',
      targetLanguage: newCampData.targetLanguage || 'English',
      targetAudience: newCampData.targetAudience || 'Literary fiction readers',
      objective: newCampData.objective || 'Maximize launch velocity',
      proposedStartDate: newCampData.proposedStartDate || '2026-11-15',
      proposedEndDate: newCampData.proposedEndDate || '2026-11-22',
      budgetUSD: newCampData.budgetUSD || 400,
      notes: newCampData.notes || '',
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    setCampaigns(prev => [newCamp, ...prev]);
  };

  // Admin Actions
  const handleApprovePublisher = (id: string) => {
    setPublishers(prev =>
      prev.map(p => (p.id === id ? { ...p, verificationStatus: 'approved' } : p))
    );
  };

  const handleRejectPublisher = (id: string) => {
    setPublishers(prev =>
      prev.map(p => (p.id === id ? { ...p, verificationStatus: 'rejected' } : p))
    );
  };

  const handleApproveBook = (id: string) => {
    setBooks(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'published' } : b))
    );
  };

  const handleApproveCampaign = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'active', adminNotes: 'Approved & Scheduled' } : c))
    );
  };

  const handleDismissReport = (commentId: string) => {
    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, reported: false } : c))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleBroadcastAnnouncement = (title: string, message: string) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title,
        message,
        date: 'Just now',
        type: 'system',
        read: false
      },
      ...prev
    ]);
  };

  // ROX Action Execution Bridge
  const handleExecuteRoxAction = (actionType: string, payload?: any) => {
    if (actionType === 'view_book') {
      const book = books.find(b => b.id === payload);
      if (book) setSelectedDetailBook(book);
    } else if (actionType === 'open_checkout') {
      const book = books.find(b => b.id === payload.bookId) || books[0];
      setCheckoutBookData({ book, edition: book.availableEditions[0] });
    } else if (actionType === 'open_discussion') {
      setChapterCircleState({ isOpen: true, chapterNumber: 1 });
    } else if (actionType === 'toggle_sound') {
      if (currentRole === 'reader' || currentRole === 'publisher') {
        handleToggleStorySound();
      }
    } else if (actionType === 'navigate_wishlist') {
      setActiveTab('favorites');
    } else if (actionType === 'open_reach_readers') {
      setActiveTab('pub-campaigns');
    } else if (actionType === 'open_payments') {
      setActiveTab('pub-earnings');
    }
  };

  // Active book object for reading
  const activeReadingBook = books.find(b => b.id === activeReadingBookId);
  const activeReadingBookTitle = activeReadingBook?.title;

  // Active book in detail modal or reader
  const contextBook = activeReadingBook || selectedDetailBook;

  // IF USER IS INSIDE READER VIEW: Render Fullscreen Reader Experience
  if (activeReadingBook) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <DemoHeader
          currentRole={currentRole}
          currentProfile={currentProfile}
          onSelectRole={handleSelectRole}
          onResetDemoData={handleResetDemoData}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
        <ReaderView
          book={activeReadingBook}
          onExit={() => setActiveReadingBookId(null)}
          onUpdateProgress={handleUpdateProgress}
          onOpenChapterCircle={chNum => setChapterCircleState({ isOpen: true, chapterNumber: chNum })}
          isStorySoundActive={isStorySoundActive}
          onToggleStorySound={handleToggleStorySound}
          currentSoundMood={currentSoundMood}
          onChangeSoundMood={handleChangeSoundMood}
          userPreferredLanguages={currentProfile.preferredLanguages}
        />

        <ChapterCircleModal
          isOpen={chapterCircleState.isOpen}
          onClose={() => setChapterCircleState(prev => ({ ...prev, isOpen: false }))}
          bookTitle={activeReadingBook.title}
          chapterNumber={chapterCircleState.chapterNumber}
          chapterTitle={activeReadingBook.chapters[chapterCircleState.chapterNumber - 1]?.title || 'Chapter Reflection'}
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReportComment={handleReportComment}
        />

        {/* ROX Drawer inside reader */}
        <RoxAssistant
          isOpen={isRoxOpen}
          onClose={() => setIsRoxOpen(false)}
          currentRole={currentRole}
          currentBook={activeReadingBook}
          currentChapterNumber={chapterCircleState.chapterNumber}
          userPurchasedBookIds={userPurchasedBookIds}
          onExecuteAction={handleExecuteRoxAction}
        />

        {/* User Profile & ID Modal */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={currentProfile}
          currentRole={currentRole}
          onSwitchRole={handleSelectRole}
          onUpdateBio={handleUpdateBio}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-[#0D5EAF]/20 selection:text-[#0D5EAF]">
      {/* 1. Prototype Persona & Feedback Strip */}
      <DemoHeader
        currentRole={currentRole}
        currentProfile={currentProfile}
        onSelectRole={handleSelectRole}
        onResetDemoData={handleResetDemoData}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 2. Top Navigation Bar (Strict 3-zone contract) */}
      <TopNav
        currentRole={currentRole}
        profile={currentProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        notifications={notifications}
        onMarkNotificationRead={id =>
          setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onToggleRox={() => setIsRoxOpen(!isRoxOpen)}
        isRoxOpen={isRoxOpen}
        isStorySoundActive={isStorySoundActive}
        onToggleStorySound={handleToggleStorySound}
        activeReadingBookTitle={userPurchasedBookIds.length > 0 ? books.find(b => b.id === userPurchasedBookIds[0])?.title : undefined}
        onOpenReader={() => {
          if (userPurchasedBookIds.length > 0) {
            setActiveReadingBookId(userPurchasedBookIds[0]);
          }
        }}
      />

      {/* 3. Main Workspace Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-6 w-full">
        {/* ROLE A: GLOBAL READER PORTAL */}
        {currentRole === 'reader' && (
          <>
            {activeTab === 'discover' && (
              <MarketplaceView
                books={books.filter(b => b.status === 'published')}
                onSelectBook={book => setSelectedDetailBook(book)}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                userPurchasedBookIds={userPurchasedBookIds}
                onPreviewStorySound={handlePreviewStorySound}
                onOpenReader={bookId => setActiveReadingBookId(bookId)}
              />
            )}

            {(activeTab === 'library' ||
              activeTab === 'progress' ||
              activeTab === 'favorites' ||
              activeTab === 'subscriptions' ||
              activeTab === 'profile') && (
              <ReaderDashboard
                activeTab={activeTab as any}
                onSelectTab={setActiveTab}
                books={books}
                userPurchasedBookIds={userPurchasedBookIds}
                favorites={favorites}
                readingProgress={readingProgress}
                transactions={transactions}
                profile={currentProfile}
                onOpenReader={bookId => setActiveReadingBookId(bookId)}
                onSelectBook={book => setSelectedDetailBook(book)}
                onToggleFavorite={handleToggleFavorite}
                onOpenProfileModal={() => setIsProfileModalOpen(true)}
              />
            )}
          </>
        )}

        {/* ROLE B: PUBLISHER PORTAL */}
        {currentRole === 'publisher' && (
          <PublisherPortal
            publisher={publishers[0]} // Horizon Global Publishing
            books={books}
            campaigns={campaigns}
            onAddNewBook={handleAddNewBook}
            onSubmitCampaign={handleSubmitCampaign}
            activeSubTab={activeTab}
            onSelectSubTab={setActiveTab}
            onOpenRoxPublisherHelp={prompt => {
              setIsRoxOpen(true);
            }}
            profile={currentProfile}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* ROLE C: ADMIN OPERATIONS & GOVERNANCE PORTAL */}
        {currentRole === 'admin' && (
          <AdminPortal
            publishers={publishers}
            books={books}
            campaigns={campaigns}
            comments={comments}
            onApprovePublisher={handleApprovePublisher}
            onRejectPublisher={handleRejectPublisher}
            onApproveBook={handleApproveBook}
            onApproveCampaign={handleApproveCampaign}
            onDismissReport={handleDismissReport}
            onDeleteComment={handleDeleteComment}
            onBroadcastAnnouncement={handleBroadcastAnnouncement}
            activeSubTab={activeTab}
            onSelectSubTab={setActiveTab}
            profile={currentProfile}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Persistent StorySound Floating Bar (Only available to Reader and Publisher) */}
      {(currentRole === 'reader' || currentRole === 'publisher') && (
        <StorySoundBar
          currentMood={currentSoundMood}
          onChangeMood={handleChangeSoundMood}
          isPlaying={isStorySoundActive}
          onTogglePlay={handleToggleStorySound}
        />
      )}

      {/* 5. Book Details Modal */}
      {selectedDetailBook && (
        <BookDetailModal
          isOpen={!!selectedDetailBook}
          onClose={() => setSelectedDetailBook(null)}
          book={selectedDetailBook}
          isOwned={userPurchasedBookIds.includes(selectedDetailBook.id)}
          isFavorite={favorites.includes(selectedDetailBook.id)}
          onToggleFavorite={handleToggleFavorite}
          onOpenCheckout={(book, edition) => setCheckoutBookData({ book, edition })}
          onStartReading={bookId => {
            setSelectedDetailBook(null);
            setActiveReadingBookId(bookId);
          }}
          onPreviewStorySound={handlePreviewStorySound}
          onOpenChapterCircle={chNum => setChapterCircleState({ isOpen: true, chapterNumber: chNum })}
        />
      )}

      {/* 6. Simulated Checkout Modal */}
      {checkoutBookData && (
        <CheckoutModal
          isOpen={!!checkoutBookData}
          onClose={() => setCheckoutBookData(null)}
          book={checkoutBookData.book}
          selectedEdition={checkoutBookData.edition}
          onConfirmPurchase={handleConfirmPurchase}
          isOwned={userPurchasedBookIds.includes(checkoutBookData.book.id)}
          onStartReading={bookId => {
            setCheckoutBookData(null);
            setActiveReadingBookId(bookId);
          }}
        />
      )}

      {/* 7. Chapter Circle Discussion Modal */}
      <ChapterCircleModal
        isOpen={chapterCircleState.isOpen}
        onClose={() => setChapterCircleState(prev => ({ ...prev, isOpen: false }))}
        bookTitle={contextBook?.title || 'The Architecture of Solitude'}
        chapterNumber={chapterCircleState.chapterNumber}
        chapterTitle={contextBook?.chapters[chapterCircleState.chapterNumber - 1]?.title || 'Chapter Reflection'}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onReportComment={handleReportComment}
      />

      {/* 8. ROX AI Assistant Slide-over Panel */}
      <RoxAssistant
        isOpen={isRoxOpen}
        onClose={() => setIsRoxOpen(false)}
        currentRole={currentRole}
        currentBook={contextBook}
        currentChapterNumber={chapterCircleState.chapterNumber}
        userPurchasedBookIds={userPurchasedBookIds}
        onExecuteAction={handleExecuteRoxAction}
      />

      {/* 9. User Profile & ID Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={currentProfile}
        currentRole={currentRole}
        onSwitchRole={handleSelectRole}
        onUpdateBio={handleUpdateBio}
      />

      {/* 10. Minimalist Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-center text-xs text-slate-500 font-mono mt-16 shadow-2xs">
        <p className="font-semibold text-slate-800">NOVELIA Global Marketplace Prototype v1.0 • “Every story deserves to be heard, read, and felt.”</p>
        <p className="text-[11px] text-slate-400 mt-1">
          StorySound™ Synthesizer · Chapter Circle™ Anti-Spoiler Shielding · ROX AI Companion · Simulated Payments
        </p>
      </footer>
    </div>
  );
}
