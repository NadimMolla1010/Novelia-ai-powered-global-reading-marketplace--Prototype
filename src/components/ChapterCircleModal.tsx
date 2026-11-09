import React, { useState } from 'react';
import { ChapterComment } from '../types';
import { MessageSquare, ThumbsUp, Flag, Send, ShieldAlert, X, Check } from 'lucide-react';

interface ChapterCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  comments: ChapterComment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
  onReportComment: (commentId: string) => void;
}

export const ChapterCircleModal: React.FC<ChapterCircleModalProps> = ({
  isOpen,
  onClose,
  bookTitle,
  chapterNumber,
  chapterTitle,
  comments,
  onAddComment,
  onLikeComment,
  onReportComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [reportedMessage, setReportedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const handleReport = (id: string) => {
    onReportComment(id);
    setReportedMessage('Comment flagged for administrator review.');
    setTimeout(() => setReportedMessage(null), 3000);
  };

  const chapterSpecificComments = comments.filter(c => c.chapterNumber === chapterNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-sky-50 text-[#0D5EAF] border border-sky-200">
                <MessageSquare className="w-4 h-4 text-[#0D5EAF]" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#0D5EAF] font-bold">
                Chapter Circle™
              </span>
              <span className="text-slate-300 text-xs">·</span>
              <span className="text-xs text-slate-500 font-medium">Chapter {chapterNumber}</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-slate-900 mt-1">
              “Share your feelings till now before the break....”
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reflections on <span className="italic text-slate-800">{bookTitle}</span>: {chapterTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-Spoiler Badge (PRD BR-08) */}
        <div className="px-6 py-2.5 bg-sky-50/80 border-b border-sky-100 flex items-center gap-2 text-xs text-slate-600">
          <ShieldAlert className="w-3.5 h-3.5 text-[#0D5EAF] shrink-0" />
          <span>
            <strong className="text-[#0D5EAF]">Anti-Spoiler Protection Active:</strong> Only reflections up to Chapter {chapterNumber} are shown. Later plot details are strictly masked.
          </span>
        </div>

        {reportedMessage && (
          <div className="px-6 py-2 bg-rose-50 border-b border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>{reportedMessage}</span>
          </div>
        )}

        {/* Discussion Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {chapterSpecificComments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-600 text-sm">Be the first to share your reflection on this chapter.</p>
              <p className="text-slate-400 text-xs mt-1">Your thoughts inspire fellow readers across the world.</p>
            </div>
          ) : (
            chapterSpecificComments.map(comment => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0D5EAF] text-white font-medium text-xs flex items-center justify-center font-serif">
                      {comment.userName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-900">
                        {comment.userName}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2 font-mono">
                        {comment.timestamp}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReport(comment.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Report comment to administrator"
                  >
                    <Flag className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed font-sans">
                  {comment.text}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] text-[#0D5EAF] font-mono font-medium">
                    Verified Chapter {chapterNumber} Reader
                  </span>

                  <button
                    onClick={() => onLikeComment(comment.id)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      comment.hasLiked
                        ? 'text-[#0D5EAF] bg-sky-100/70 font-semibold'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${comment.hasLiked ? 'fill-current' : ''}`} />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Composer */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="What emotions or theories did this chapter evoke?"
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D5EAF] focus:ring-2 focus:ring-sky-100 shadow-2xs"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2.5 bg-[#0D5EAF] hover:bg-[#094787] disabled:opacity-40 disabled:hover:bg-[#0D5EAF] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 text-right font-mono">
            Follows NOVELIA community guidelines · No spoilers permitted
          </p>
        </form>
      </div>
    </div>
  );
};
