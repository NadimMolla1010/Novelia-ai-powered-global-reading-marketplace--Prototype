export type UserRole = 'reader' | 'publisher' | 'admin';

export type StorySoundMood = 'peaceful' | 'reflective' | 'mystery' | 'romantic' | 'action';

export interface StorySoundTrack {
  id: string;
  title: string;
  mood: StorySoundMood;
  tempo: string;
  description: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  readTimeMinutes: number;
  audioTrack: StorySoundTrack;
  content: string[];
  summary: string;
  keyEvents: string[];
}

export interface BookEdition {
  language: string;
  languageCode: string;
  translator?: string;
  type: 'publisher_approved' | 'ai_draft';
  isOriginal: boolean;
}

export interface BookReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  publisherId: string;
  publisherName: string;
  genre: string;
  originalLanguage: string;
  availableEditions: BookEdition[];
  coverImage: string;
  releaseDate: string; // ISO string
  launchPriceUSD: number; // e.g. 2.00
  regularPriceUSD: number; // e.g. 4.00
  promotionalPeriodDays: number; // 7 days
  description: string;
  rating: number;
  reviewCount: number;
  totalPages: number;
  chapters: Chapter[];
  featured?: boolean;
  audioMood: StorySoundMood;
  status: 'published' | 'under_review' | 'draft' | 'archived';
  adminFeedback?: string;
  unitsSold: number;
  activeReaders: number;
  completionRate: number;
}

export interface ReaderProgress {
  bookId: string;
  currentChapterId: string;
  lastReadDate: string;
  completionPercentage: number;
  bookmarks: number[]; // chapter numbers
  highlights: {
    id: string;
    chapterNumber: number;
    text: string;
    note?: string;
  }[];
}

export interface Transaction {
  id: string;
  type: 'book_purchase' | 'subscription' | 'publisher_payout';
  bookId?: string;
  bookTitle?: string;
  amountUSD: number;
  grossAmountUSD?: number;
  commissionAmountUSD?: number;
  publisherNetUSD?: number;
  status: 'successful' | 'pending' | 'refunded' | 'cancelled';
  date: string;
  receiptNumber: string;
  paymentMethod: string;
  editionLanguage?: string;
}

export interface ChapterComment {
  id: string;
  bookId: string;
  chapterNumber: number;
  userName: string;
  userRole?: string;
  avatarColor: string;
  text: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  reported: boolean;
}

export type CampaignStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'active' | 'completed';

export interface CampaignRequest {
  id: string;
  publisherId: string;
  publisherName: string;
  bookId: string;
  bookTitle: string;
  campaignType: 'New Release Spotlight' | 'Genre Feature' | 'Global Homepage Banner' | 'Author Discovery Special';
  targetRegion: string;
  targetLanguage: string;
  targetAudience: string;
  objective: string;
  proposedStartDate: string;
  proposedEndDate: string;
  budgetUSD: number;
  notes: string;
  status: CampaignStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface PublisherAccount {
  id: string;
  name: string;
  organizationType: 'independent_author' | 'publishing_company';
  contactEmail: string;
  country: string;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  documentsSubmitted: boolean;
  payoutDetailsConfigured: boolean;
  payoutMethod: string;
  commissionRate: number; // 0.20
  joinedDate: string;
}

export interface RoxMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextTag?: string;
  citations?: string[];
  suggestedActions?: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
  requiresConfirmation?: boolean;
  pendingAction?: {
    type: string;
    title: string;
    description: string;
    payload: any;
  };
}

export interface NoveliaNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'release' | 'purchase' | 'community' | 'campaign' | 'system';
  read: boolean;
  linkAction?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  handle: string;
  role: UserRole;
  email: string;
  avatarColor: string;
  country: string;
  city: string;
  joinedDate: string;
  preferredLanguages: string[];
  status: string;
  bio: string;
  walletBalanceUSD?: number;
  organization?: string;
  payoutMethod?: string;
  securityBadge?: string;
  readingInterests?: string[];
  subscriptionTier?: string;
}

