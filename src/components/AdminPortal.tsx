import React, { useState } from 'react';
import { PublisherAccount, Book, CampaignRequest, ChapterComment, NoveliaNotification, UserProfile } from '../types';
import {
  ShieldCheck,
  Building2,
  BookOpen,
  Send,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Megaphone,
  Sliders,
  Check,
  User,
  Lock,
  Key
} from 'lucide-react';

interface AdminPortalProps {
  publishers: PublisherAccount[];
  books: Book[];
  campaigns: CampaignRequest[];
  comments: ChapterComment[];
  onApprovePublisher: (publisherId: string) => void;
  onRejectPublisher: (publisherId: string) => void;
  onApproveBook: (bookId: string) => void;
  onApproveCampaign: (campaignId: string) => void;
  onDismissReport: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onBroadcastAnnouncement: (title: string, message: string) => void;
  activeSubTab: string;
  onSelectSubTab: (subTab: string) => void;
  profile?: UserProfile;
  onOpenProfileModal?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  publishers,
  books,
  campaigns,
  comments,
  onApprovePublisher,
  onRejectPublisher,
  onApproveBook,
  onApproveCampaign,
  onDismissReport,
  onDeleteComment,
  onBroadcastAnnouncement,
  activeSubTab,
  onSelectSubTab,
  profile,
  onOpenProfileModal
}) => {
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const pendingPublishers = publishers.filter(p => p.verificationStatus === 'pending');
  const pendingBooks = books.filter(b => b.status === 'under_review');
  const pendingCampaigns = campaigns.filter(c => c.status === 'submitted' || c.status === 'under_review');
  const reportedComments = comments.filter(c => c.reported);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    onBroadcastAnnouncement(announcementTitle.trim(), announcementMsg.trim());
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Operations Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-sky-50 text-[#0D5EAF] border border-sky-200">
              <ShieldCheck className="w-4 h-4 text-[#0D5EAF]" />
            </span>
            <span className="text-xs font-mono uppercase text-[#0D5EAF] font-bold tracking-wider">
              Platform Administration & Moderation
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            NOVELIA Operations & Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based operational oversight: publisher verification, book approval, Reach Readers campaigns, and community safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
            <span className="text-slate-500 font-mono block text-[10px]">Active Platform Fee</span>
            <span className="text-[#0D5EAF] font-bold font-mono">20% Gross Royalty Pool</span>
          </div>
        </div>
      </div>

      {/* Admin Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => onSelectSubTab('admin-overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'admin-overview'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Operations Overview
        </button>

        <button
          onClick={() => onSelectSubTab('admin-publishers')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'admin-publishers'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Publisher Verification</span>
          {pendingPublishers.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingPublishers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectSubTab('admin-books')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'admin-books'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Book Moderation</span>
          {pendingBooks.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingBooks.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectSubTab('admin-campaigns')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'admin-campaigns'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Campaign Approvals</span>
          {pendingCampaigns.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingCampaigns.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectSubTab('admin-community')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'admin-community'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Community Moderation</span>
          {reportedComments.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {reportedComments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectSubTab('admin-profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'admin-profile'
              ? 'bg-[#0D5EAF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Admin Profile & ID</span>
        </button>
      </div>

      {/* SUB-TAB 1: OPERATIONS OVERVIEW */}
      {activeSubTab === 'admin-overview' && (
        <section className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Total Registered Publishers</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-2">{publishers.length}</p>
              <span className="text-[11px] text-[#0D5EAF] font-mono mt-1 block font-medium">
                {pendingPublishers.length} awaiting approval
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Live Catalog Titles</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
                {books.filter(b => b.status === 'published').length}
              </p>
              <span className="text-[11px] text-emerald-600 font-mono mt-1 block font-medium">
                100% compliant with DRM rules
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Platform Commission Pool (20%)</span>
              <p className="text-2xl font-bold font-mono text-[#0D5EAF] mt-2">$2,840.00</p>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Gross GMV: $14,200.00
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Active Reach Readers Campaigns</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                {pendingCampaigns.length} under evaluation
              </span>
            </div>
          </div>

          {/* Broadcast Announcement Form */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-4 h-4 text-[#0D5EAF]" />
              <h3 className="text-sm font-semibold text-slate-900">
                Broadcast Platform Announcement
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Sends an instant in-app notification to all active readers and publishers.
            </p>

            {broadcastSuccess && (
              <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Announcement published to global notification stream!</span>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <input
                type="text"
                value={announcementTitle}
                onChange={e => setAnnouncementTitle(e.target.value)}
                placeholder="Announcement Title (e.g., Nov 2026 Mediterranean Literary Showcase)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF] focus:ring-2 focus:ring-sky-100"
              />
              <textarea
                rows={2}
                value={announcementMsg}
                onChange={e => setAnnouncementMsg(e.target.value)}
                placeholder="Announcement details..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#0D5EAF] focus:ring-2 focus:ring-sky-100 resize-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Broadcast to Platform
              </button>
            </form>
          </div>
        </section>
      )}

      {/* SUB-TAB 2: PUBLISHER QUEUE */}
      {activeSubTab === 'admin-publishers' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Publisher Accounts & Verification Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review organization documents, compliance records, and payout configurations.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Publisher Name</th>
                  <th className="py-3 px-4">Type & Country</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Payout Method</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {publishers.map(pub => (
                  <tr key={pub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {pub.name}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {pub.contactEmail}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {pub.organizationType === 'publishing_company' ? 'Publishing House' : 'Independent Author'}
                      <span className="text-slate-400 block text-[10px]">
                        {pub.country}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {pub.documentsSubmitted ? (
                        <span className="text-emerald-600 text-[11px] flex items-center gap-1 font-mono font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Verified KYC
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Pending Upload</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {pub.payoutMethod}
                    </td>

                    <td className="py-3 px-4">
                      {pub.verificationStatus === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {pub.verificationStatus === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0D5EAF] text-[11px] font-semibold border border-sky-200">
                          Awaiting Review
                        </span>
                      )}
                      {pub.verificationStatus === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px]">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {pub.verificationStatus === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApprovePublisher(pub.id)}
                            className="px-2.5 py-1 bg-[#0D5EAF] hover:bg-[#094787] text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectPublisher(pub.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-[11px] rounded-lg transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SUB-TAB 3: BOOK MODERATION QUEUE */}
      {activeSubTab === 'admin-books' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Book Moderation & Rights Verification
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure manuscript compliance, original translation rights, and StorySound licensing (PRD BR-10 & BR-15).
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Book Title & Author</th>
                  <th className="py-3 px-4">Publisher</th>
                  <th className="py-3 px-4">Language & Rights</th>
                  <th className="py-3 px-4">Pricing Window</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-8 h-11 object-cover rounded bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{book.title}</p>
                        <span className="text-[10px] text-slate-500">By {book.author}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {book.publisherName}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {book.originalLanguage} ({book.availableEditions.length} approved)
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      Launch: ${book.launchPriceUSD.toFixed(2)} / Regular: ${book.regularPriceUSD.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      {book.status === 'published' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          Live on Marketplace
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0D5EAF] text-[11px] font-semibold border border-sky-200">
                          Awaiting Approval
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {book.status === 'under_review' ? (
                        <button
                          onClick={() => onApproveBook(book.id)}
                          className="px-3 py-1 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Approve & Publish
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SUB-TAB 4: REACH READERS CAMPAIGN APPROVALS */}
      {activeSubTab === 'admin-campaigns' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Reach Readers™ Promotion Approval Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review promotional campaign requests submitted by publishers (PRD Section 7.6 & BR-12).
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Book & Publisher</th>
                  <th className="py-3 px-4">Campaign Type</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Target Region</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {campaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{camp.bookTitle}</p>
                      <span className="text-[10px] text-slate-500">By {camp.publisherName}</span>
                    </td>

                    <td className="py-3 px-4 text-[#0D5EAF] font-mono text-[11px] font-semibold">
                      {camp.campaignType}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ${camp.budgetUSD} USD
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {camp.targetRegion}
                    </td>

                    <td className="py-3 px-4">
                      {camp.status === 'active' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          Active
                        </span>
                      )}
                      {(camp.status === 'submitted' || camp.status === 'under_review') && (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0D5EAF] text-[11px] font-semibold border border-sky-200">
                          Pending Approval
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {camp.status !== 'active' ? (
                        <button
                          onClick={() => onApproveCampaign(camp.id)}
                          className="px-3 py-1 bg-[#0D5EAF] hover:bg-[#094787] text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Approve & Schedule
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Running</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SUB-TAB 5: COMMUNITY MODERATION */}
      {activeSubTab === 'admin-community' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Chapter Circle™ Community Moderation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review flagged or reported reader comments and enforce community guidelines (PRD 6.7).
            </p>
          </div>

          <div className="space-y-3">
            {reportedComments.length === 0 ? (
              <div className="p-8 text-center border border-slate-200 rounded-3xl bg-white shadow-xs">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-slate-800 text-sm font-medium">All clear! No reported comments in the queue.</p>
                <p className="text-slate-500 text-xs mt-0.5">Chapter Circle community discussions are positive and spoiler-safe.</p>
              </div>
            ) : (
              reportedComments.map(c => (
                <div
                  key={c.id}
                  className="p-4 bg-white border border-rose-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-semibold text-slate-900">
                        Reported comment by {c.userName} (Chapter {c.chapterNumber})
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      "{c.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onDismissReport(c.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => onDeleteComment(c.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Remove Comment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* SUB-TAB 6: ADMIN PROFILE & ID */}
      {activeSubTab === 'admin-profile' && profile && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Administrator Profile & Governance Clearance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                NOVELIA Operations, trust & safety security credentials, and platform oversight authority
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
                    {profile.handle} · {profile.status}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-mono">Governance Level</span>
                <span className="text-xl font-bold font-mono text-[#0D5EAF]">Tier-3 Root Admin</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Official Contact</span>
                <span className="font-semibold text-slate-900 mt-1 block">{profile.email}</span>
                <span className="text-[10px] text-slate-400 font-mono">Signed with GPG key #4A19B</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Jurisdiction Base</span>
                <span className="font-semibold text-slate-900 mt-1 block">{profile.city}, {profile.country}</span>
                <span className="text-[10px] text-slate-400 font-mono">European Digital Services Act Officer</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Security Clearance</span>
                <span className="font-semibold text-emerald-700 mt-1 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{profile.securityBadge}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Hardware U2F Authenticated</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-slate-200">
              <span className="text-xs font-semibold text-slate-900 uppercase font-mono block mb-1">
                Administrative Mandate & Code of Conduct
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {profile.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-xs font-semibold text-slate-900 uppercase font-mono block mb-2">
                  Operating Languages & Moderation Scope
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
                  Delegated Administrative Privileges
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Publisher KYC & bank disbursement validation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manuscript review & authorized edition verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Chapter Circle community anti-spoiler shielding</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
