import React, { useState } from 'react';
import { Book, PublisherAccount, CampaignRequest, StorySoundMood, UserProfile } from '../types';
import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Plus,
  Send,
  CheckCircle,
  Clock,
  Download,
  Tag,
  BarChart2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  User,
  X
} from 'lucide-react';

interface PublisherPortalProps {
  publisher: PublisherAccount;
  books: Book[];
  campaigns: CampaignRequest[];
  onAddNewBook: (newBook: Partial<Book>) => void;
  onSubmitCampaign: (campaign: Partial<CampaignRequest>) => void;
  activeSubTab: string;
  onSelectSubTab: (subTab: string) => void;
  onOpenRoxPublisherHelp: (prompt: string) => void;
  profile?: UserProfile;
  onOpenProfileModal?: () => void;
}

export const PublisherPortal: React.FC<PublisherPortalProps> = ({
  publisher,
  books,
  campaigns,
  onAddNewBook,
  onSubmitCampaign,
  activeSubTab,
  onSelectSubTab,
  onOpenRoxPublisherHelp,
  profile,
  onOpenProfileModal
}) => {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  const myBooks = books.filter(b => b.publisherId === publisher.id);

  const totalUnitsSold = myBooks.reduce((acc, b) => acc + (b.unitsSold || 0), 0);
  const totalGrossRevenue = myBooks.reduce((acc, b) => acc + (b.unitsSold * 3.10), 0);
  const platformCommissionRate = publisher.commissionRate || 0.20;
  const platformCommissionAmount = totalGrossRevenue * platformCommissionRate;
  const publisherNetEarnings = totalGrossRevenue - platformCommissionAmount;
  const totalActiveReaders = myBooks.reduce((acc, b) => acc + (b.activeReaders || 0), 0);

  // New Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('Clara Vance');
  const [newGenre, setNewGenre] = useState('Literary Fiction');
  const [newLang, setNewLang] = useState('English');
  const [newLaunchPrice, setNewLaunchPrice] = useState(2.00);
  const [newRegularPrice, setNewRegularPrice] = useState(4.00);
  const [newDescription, setNewDescription] = useState('');
  const [newAudioMood, setNewAudioMood] = useState<StorySoundMood>('reflective');

  // Reach Readers Campaign Form State
  const [campBookId, setCampBookId] = useState(myBooks[0]?.id || '');
  const [campType, setCampType] = useState<'New Release Spotlight' | 'Genre Feature' | 'Global Homepage Banner' | 'Author Discovery Special'>('New Release Spotlight');
  const [campRegion, setCampRegion] = useState('Global (North America & Western Europe)');
  const [campLanguages, setCampLanguages] = useState('English, Spanish, French');
  const [campAudience, setCampAudience] = useState('Literary readers, historical fiction enthusiasts');
  const [campObjective, setCampObjective] = useState('Maximize 7-day launch special velocity');
  const [campBudget, setCampBudget] = useState(450);
  const [campNotes, setCampNotes] = useState('Please prioritize StorySound featured tag.');

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddNewBook({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'A Novel',
      author: newAuthor.trim(),
      publisherId: publisher.id,
      publisherName: publisher.name,
      genre: newGenre,
      originalLanguage: newLang,
      launchPriceUSD: newLaunchPrice,
      regularPriceUSD: newRegularPrice,
      promotionalPeriodDays: 7,
      description: newDescription.trim() || 'A compelling new literary work presented with authorized language editions and StorySound accompaniment.',
      audioMood: newAudioMood,
      status: 'under_review',
      coverImage: '/src/assets/images/book_cover_solitude_1794218149274.jpg'
    });

    setIsAddBookModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = myBooks.find(b => b.id === campBookId) || myBooks[0];

    onSubmitCampaign({
      publisherId: publisher.id,
      publisherName: publisher.name,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      campaignType: campType,
      targetRegion: campRegion,
      targetLanguage: campLanguages,
      targetAudience: campAudience,
      objective: campObjective,
      budgetUSD: campBudget,
      notes: campNotes,
      status: 'submitted',
      proposedStartDate: '2026-11-15',
      proposedEndDate: '2026-11-22'
    });

    setIsCampaignModalOpen(false);
  };

  const triggerPayoutRequest = () => {
    setPayoutSuccessMessage(`Payout request of $${publisherNetEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })} submitted. Funds will transfer to ${publisher.payoutMethod} within 48 business hours.`);
    setTimeout(() => setPayoutSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Publisher Header Summary */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#0D5EAF] font-bold tracking-wider">
              Publisher Portal
            </span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Publisher Account
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            {publisher.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered in {publisher.country} · Organization Type: {publisher.organizationType === 'publishing_company' ? 'Publishing House' : 'Independent Author'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="px-4 py-2.5 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Book</span>
          </button>

          <button
            onClick={() => setIsCampaignModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5 text-[#0D5EAF]" />
            <span>Request Reach Readers Campaign</span>
          </button>
        </div>
      </div>

      {payoutSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{payoutSuccessMessage}</span>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Units Sold */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Units Sold</span>
            <BookOpen className="w-4 h-4 text-[#0D5EAF]" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {totalUnitsSold.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-mono font-medium">
            <ArrowUpRight className="w-3 h-3" />
            +18% from last week
          </span>
        </div>

        {/* Metric 2: Gross Revenue */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Gross Sales Volume</span>
            <DollarSign className="w-4 h-4 text-[#0D5EAF]" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ${totalGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Before 20% platform share
          </span>
        </div>

        {/* Metric 3: Publisher Net Earnings (80%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Estimated Net Share (80%)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#0D5EAF] mt-2">
            ${publisherNetEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Payable via {publisher.payoutMethod.split(' ')[0]}
          </span>
        </div>

        {/* Metric 4: Active Readers */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Readers</span>
            <Users className="w-4 h-4 text-[#0D5EAF]" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {totalActiveReaders.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#0D5EAF] font-mono mt-1 block font-medium">
            Avg. Completion: 74%
          </span>
        </div>
      </div>

      {/* Publisher Sub-navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => onSelectSubTab('pub-overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'pub-overview' || activeSubTab === 'pub-catalog'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Catalog & Uploads ({myBooks.length})
        </button>

        <button
          onClick={() => onSelectSubTab('pub-analytics')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'pub-analytics'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Reader Engagement & Drop-off
        </button>

        <button
          onClick={() => onSelectSubTab('pub-earnings')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'pub-earnings'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Royalties & Payouts
        </button>

        <button
          onClick={() => onSelectSubTab('pub-campaigns')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'pub-campaigns'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Reach Readers Campaigns ({campaigns.filter(c => c.publisherId === publisher.id).length})
        </button>

        <button
          onClick={() => onSelectSubTab('pub-profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'pub-profile'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Publisher Profile & ID</span>
        </button>
      </div>

      {/* SUB-TAB 1: CATALOG & BOOK MANAGEMENT */}
      {(activeSubTab === 'pub-overview' || activeSubTab === 'pub-catalog') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Book Catalog & Approval Status
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Per rule BR-10, all published books undergo administrative review before public release.
              </p>
            </div>

            <button
              onClick={() => onOpenRoxPublisherHelp('Suggest how to optimize metadata for my books')}
              className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0D5EAF] hover:bg-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0D5EAF]" />
              <span>ROX Catalog Optimization</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Cover & Title</th>
                  <th className="py-3 px-4">Genre / Language</th>
                  <th className="py-3 px-4">Pricing Window</th>
                  <th className="py-3 px-4">Sales / Readers</th>
                  <th className="py-3 px-4">Review Status</th>
                  <th className="py-3 px-4 text-right">StorySound Mood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {myBooks.map(book => {
                  const releaseTime = new Date(book.releaseDate).getTime();
                  const daysSinceRelease = (Date.now() - releaseTime) / (1000 * 60 * 60 * 24);
                  const isLaunch = daysSinceRelease <= (book.promotionalPeriodDays || 7);

                  return (
                    <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded-md bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{book.title}</p>
                          <span className="text-[11px] text-slate-500">By {book.author}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        <span className="text-[#0D5EAF] font-semibold">{book.genre}</span> · {book.originalLanguage}
                        <span className="text-slate-400 block text-[10px]">
                          {book.availableEditions.length} Editions Approved
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-900 font-semibold">
                          Launch: ${book.launchPriceUSD.toFixed(2)} / Reg: ${book.regularPriceUSD.toFixed(2)}
                        </div>
                        {isLaunch ? (
                          <span className="text-[10px] text-[#0D5EAF] font-semibold flex items-center gap-1 mt-0.5">
                            <Tag className="w-2.5 h-2.5" />
                            Launch Window Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            Regular Price Window
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="text-slate-900 font-bold">{book.unitsSold || 0}</span> copies
                        <span className="text-slate-500 block text-[10px]">
                          {book.activeReaders || 0} active readers
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {book.status === 'published' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                            Published & Live
                          </span>
                        )}
                        {book.status === 'under_review' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0D5EAF] text-[11px] font-semibold border border-sky-200">
                            Awaiting Admin Review
                          </span>
                        )}
                        {book.status === 'draft' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-500 capitalize">
                        {book.audioMood}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SUB-TAB 2: READER ANALYTICS & DROP-OFF */}
      {activeSubTab === 'pub-analytics' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Reader Engagement & Completion Analytics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated reader telemetry complying with GDPR & NOVELIA privacy rules (BR-13)
              </p>
            </div>

            <button
              onClick={() => onOpenRoxPublisherHelp('Analyze reader engagement and drop-off rates for The Architecture of Solitude')}
              className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0D5EAF] hover:bg-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0D5EAF]" />
              <span>ROX Engagement Insights</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 md:col-span-2 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center justify-between">
                <span>Chapter-by-Chapter Retention (“The Architecture of Solitude”)</span>
                <span className="text-xs font-mono text-emerald-600 font-bold">74% Overall Completion</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Chapter 1: The Blueprints of Jutland</span>
                    <span className="font-mono text-emerald-600 font-bold">91% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Chapter 2: The Unaddressed Citizen</span>
                    <span className="font-mono text-emerald-600 font-bold">83% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '83%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>Chapter 3: The Weight of Stone</span>
                    <span className="font-mono text-[#0D5EAF] font-bold">74% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-[#0D5EAF] h-2 rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-sky-50/70 rounded-2xl text-xs text-slate-700 leading-relaxed border border-sky-100">
                💡 <strong className="text-[#0D5EAF]">ROX Telemetry Note:</strong> Readers spend 6.4 minutes on average in Chapter 1 with StorySound active. Chapter Circle participation rate is 24% after completion of Chapter 1.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900">
                Audience Demographics & Editions
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">English (Original)</span>
                  <span className="font-mono font-bold text-slate-900">64% of sales</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Spanish Authorized Edition</span>
                  <span className="font-mono font-bold text-slate-900">19% of sales</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">French Authorized Edition</span>
                  <span className="font-mono font-bold text-slate-900">12% of sales</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">German Authorized Edition</span>
                  <span className="font-mono font-bold text-slate-900">5% of sales</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 3: ROYALTIES & PAYOUTS */}
      {activeSubTab === 'pub-earnings' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Publisher Payments & Royalty Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent revenue-share: 80% Publisher Share / 20% Platform Commission (PRD Section 7.5)
              </p>
            </div>

            <button
              onClick={triggerPayoutRequest}
              className="px-4 py-2 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
            >
              <DollarSign className="w-4 h-4" />
              <span>Request Payout Transfer</span>
            </button>
          </div>

          {/* Revenue Share Breakdown Graphic */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl grid md:grid-cols-3 gap-6 shadow-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-mono text-slate-500">Gross Sales Volume</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">
                ${totalGrossRevenue.toFixed(2)} USD
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                100% of reader purchase payments
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-mono text-slate-500">Platform Commission (20%)</span>
              <p className="text-xl font-bold font-mono text-[#0D5EAF] mt-1">
                -${platformCommissionAmount.toFixed(2)} USD
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Servers, StorySound streaming & ROX AI
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-mono text-emerald-600 font-semibold">Net Publisher Royalty (80%)</span>
              <p className="text-xl font-bold font-mono text-emerald-600 mt-1">
                ${publisherNetEarnings.toFixed(2)} USD
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Directly payable to your configured bank account
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 4: REACH READERS PROMOTIONAL CAMPAIGNS */}
      {activeSubTab === 'pub-campaigns' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Reach Readers™ — Platform Promotion Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit promotional campaign requests for administrative review and editorial spotlighting (PRD 7.6)
              </p>
            </div>

            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="px-4 py-2 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign Request</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Campaign Type</th>
                  <th className="py-3 px-4">Target Audience / Region</th>
                  <th className="py-3 px-4">Proposed Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {campaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {camp.bookTitle}
                    </td>

                    <td className="py-3 px-4 text-[#0D5EAF] font-mono text-[11px] font-semibold">
                      {camp.campaignType}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {camp.targetRegion}
                      <span className="text-slate-400 block text-[10px]">
                        Lang: {camp.targetLanguage}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ${camp.budgetUSD} USD
                    </td>

                    <td className="py-3 px-4">
                      {camp.status === 'active' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          Active & Running
                        </span>
                      )}
                      {camp.status === 'under_review' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0D5EAF] text-[11px] font-semibold border border-sky-200">
                          Under Review
                        </span>
                      )}
                      {camp.status === 'submitted' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] border border-slate-200">
                          Submitted
                        </span>
                      )}
                      {camp.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                          Approved for Launch
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right text-slate-500 text-[11px] italic">
                      {camp.adminNotes || 'Under administrative queue'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SUB-TAB 5: PUBLISHER PROFILE & ID */}
      {activeSubTab === 'pub-profile' && profile && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Publisher Profile & Corporate Credentials
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official entity registration, payout routes, and verified representative identity
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

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${profile.avatarColor} text-white flex items-center justify-center text-xl font-serif font-bold shadow-sm`}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-bold text-slate-900">{profile.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[#0D5EAF] text-[10px] font-mono font-bold border border-sky-200">
                      {profile.userId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {profile.handle} · {profile.organization}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-mono">Commission Share</span>
                <span className="text-xl font-bold font-mono text-emerald-600">80% Net Royalties</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Corporate Representative</span>
                <span className="font-semibold text-slate-900 mt-1 block">{profile.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{profile.email}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Headquarters</span>
                <span className="font-semibold text-slate-900 mt-1 block">{profile.city}, {profile.country}</span>
                <span className="text-[10px] text-slate-400 font-mono">Registered Publishing House</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Payout Method</span>
                <span className="font-semibold text-[#0D5EAF] mt-1 block">{profile.payoutMethod}</span>
                <span className="text-[10px] text-emerald-600 font-mono">Verified for automated transfers</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
              <span className="text-xs font-semibold text-slate-900 uppercase font-mono block mb-1">
                Publisher Editorial Vision
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {profile.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs font-semibold text-slate-900 uppercase font-mono block mb-2">
                  Publishing & Translation Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferredLanguages.map((lang, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#0D5EAF] text-xs font-medium border border-sky-100">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs font-semibold text-slate-900 uppercase font-mono block mb-2">
                  Security & Compliance Status
                </span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{profile.securityBadge}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0D5EAF]" />
                    <span>EU / UK Digital Copyright Verified (PRD BR-10)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODAL 1: UPLOAD NEW BOOK WIZARD */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <span className="font-serif font-bold text-base text-slate-900">
                Upload New Book & Chapter Configuration
              </span>
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., The Midnight Cartographer"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF] focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  placeholder="e.g., An Atmospheric Mystery"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Genre</label>
                  <select
                    value={newGenre}
                    onChange={e => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF]"
                  >
                    <option value="Literary Fiction">Literary Fiction</option>
                    <option value="Sci-Fi & Speculative">Sci-Fi & Speculative</option>
                    <option value="Mystery & Thriller">Mystery & Thriller</option>
                    <option value="Philosophy & Essays">Philosophy & Essays</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    7-Day Launch Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLaunchPrice}
                    onChange={e => setNewLaunchPrice(parseFloat(e.target.value) || 2.0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Regular Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newRegularPrice}
                    onChange={e => setNewRegularPrice(parseFloat(e.target.value) || 4.0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  StorySound™ Chapter Atmosphere
                </label>
                <select
                  value={newAudioMood}
                  onChange={e => setNewAudioMood(e.target.value as StorySoundMood)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF] capitalize"
                >
                  <option value="reflective">Reflective (Piano & Cello)</option>
                  <option value="peaceful">Peaceful (Nature Pads)</option>
                  <option value="mystery">Mystery (Ambient Noir)</option>
                  <option value="romantic">Romantic (Lush Strings)</option>
                  <option value="action">Action (Cinematic Pulse)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Book Description / Synopsis</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Provide a compelling synopsis for global readers..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Submit for Administrative Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REACH READERS PROMOTION REQUEST WIZARD */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <span className="font-serif font-bold text-base text-slate-900">
                Reach Readers™ Campaign Request
              </span>
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Book</label>
                <select
                  value={campBookId}
                  onChange={e => setCampBookId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                >
                  {myBooks.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.genre})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Campaign Type</label>
                <select
                  value={campType}
                  onChange={e => setCampType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                >
                  <option value="New Release Spotlight">New Release Spotlight</option>
                  <option value="Genre Feature">Genre Feature Shelf</option>
                  <option value="Global Homepage Banner">Global Homepage Banner</option>
                  <option value="Author Discovery Special">Author Discovery Special</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Region</label>
                  <input
                    type="text"
                    value={campRegion}
                    onChange={e => setCampRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Languages</label>
                  <input
                    type="text"
                    value={campLanguages}
                    onChange={e => setCampLanguages(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Budget Allocation ($ USD)</label>
                <input
                  type="number"
                  value={campBudget}
                  onChange={e => setCampBudget(parseInt(e.target.value) || 300)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Campaign Objective & Notes</label>
                <textarea
                  rows={2}
                  value={campNotes}
                  onChange={e => setCampNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Submit Campaign to Admins
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
