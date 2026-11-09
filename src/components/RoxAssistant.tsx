import React, { useState, useRef, useEffect } from 'react';
import { RoxMessage, UserRole, Book } from '../types';
import { askRoxAssistant } from '../services/roxEngine';
import { Bot, Send, Sparkles, X, ShieldAlert, BookOpen, Clock, ArrowRight, CornerDownLeft } from 'lucide-react';

interface RoxAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentBook?: Book | null;
  currentChapterNumber?: number;
  userPurchasedBookIds: string[];
  readingProgress?: Record<string, number>;
  onExecuteAction?: (actionType: string, payload?: any) => void;
}

export const RoxAssistant: React.FC<RoxAssistantProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentBook,
  currentChapterNumber = 1,
  userPurchasedBookIds,
  readingProgress,
  onExecuteAction
}) => {
  const [messages, setMessages] = useState<RoxMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        currentRole === 'reader'
          ? `Hello! I am **ROX**, your reading companion on NOVELIA.\n\nI can help you with in-book passage lookups, spoiler-masked chapter recaps, book recommendations, and purchase reminders.\n\nWhat would you like to explore today?`
          : currentRole === 'publisher'
          ? `Welcome to the Publisher Portal! I am **ROX**, your catalog & analytics assistant.\n\nI can help you analyze revenue with our transparent 80/20 royalty model, evaluate reader drop-off rates by chapter, draft promotional book blurbs, and prepare Reach Readers™ campaign proposals.`
          : `Hello Administrator. I am **ROX**, monitoring compliance, review queues, and platform commission governance.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: RoxMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askRoxAssistant(text, {
        role: currentRole,
        currentBook,
        currentChapterNumber,
        userPurchasedBookIds,
        readingProgress
      });

      setMessages(prev => [...prev, response]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your query. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickPrompts = () => {
    if (currentRole === 'reader') {
      return [
        { label: 'Summarize Chapter 1 (No Spoilers)', prompt: 'Summarize chapter 1 without spoilers' },
        { label: 'Find passage about Astrid', prompt: 'Where is Astrid mentioned in the letters?' },
        { label: 'Remind me to purchase on Friday', prompt: 'Remind me to purchase this book on Friday' },
        { label: 'Recommend mystery titles', prompt: 'Recommend mystery and atmospheric books' }
      ];
    }
    if (currentRole === 'publisher') {
      return [
        { label: 'Which book generated top revenue?', prompt: 'Which of my books generated the highest revenue this month?' },
        { label: 'Analyze reader drop-off rates', prompt: 'Analyze reader engagement and drop-off points for my latest book' },
        { label: 'Draft promotional blurb', prompt: 'Generate a draft promotional book description for Clara Vance' },
        { label: 'Suggest Reach Readers campaign', prompt: 'Suggest a campaign strategy for my novel' }
      ];
    }
    return [
      { label: 'Review pending publisher accounts', prompt: 'What publisher accounts are awaiting verification?' },
      { label: 'Platform commission summary', prompt: 'Summarize platform revenue and commission balance' }
    ];
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0D5EAF]">
            <Bot className="w-4 h-4 text-[#0D5EAF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-slate-900">ROX Assistant</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-sky-100 text-[#0D5EAF] uppercase font-bold">
                {currentRole} Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {currentBook ? `Context: ${currentBook.title} (Ch. ${currentChapterNumber})` : 'Contextual AI Companion'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-[#0D5EAF] text-white font-medium rounded-br-xs shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                {msg.content}

                {/* Citations if any */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                    <span className="font-semibold block mb-0.5 text-slate-700">Source & Verification:</span>
                    {msg.citations.map((cite, i) => (
                      <span key={i} className="block text-[#0D5EAF] font-mono font-medium">
                        • {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action suggestions */}
              {msg.suggestedActions && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (onExecuteAction) onExecuteAction(act.actionType, act.payload);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[11px] text-[#0D5EAF] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#0D5EAF]" />
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
            <Bot className="w-4 h-4 animate-spin text-[#0D5EAF]" />
            <span>ROX is thinking and checking spoiler boundaries...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts strip */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80 overflow-x-auto flex gap-1.5">
        {getQuickPrompts().map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp.prompt)}
            className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 text-[11px] rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs font-medium"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={
              currentRole === 'reader'
                ? 'Ask about chapters, search passages, or set a reminder...'
                : 'Ask about sales, royalties, drop-off rates, blurbs...'
            }
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D5EAF] focus:ring-2 focus:ring-sky-100"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-[#0D5EAF] hover:bg-[#094787] disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 mt-1.5 text-center font-mono">
          ROX grounds answers in authorized book data & enforces spoiler boundaries (BR-13)
        </p>
      </div>
    </div>
  );
};
