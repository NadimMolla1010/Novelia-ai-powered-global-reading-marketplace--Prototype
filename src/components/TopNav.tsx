import React, { useState } from 'react';
import { UserRole, NoveliaNotification, UserProfile } from '../types';
import { Bell, Bot, Volume2, Bookmark, Check, X, User } from 'lucide-react';

interface TopNavProps {
  currentRole: UserRole;
  profile: UserProfile;
  onOpenProfile: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  notifications: NoveliaNotification[];
  onMarkNotificationRead: (id: string) => void;
  onToggleRox: () => void;
  isRoxOpen: boolean;
  isStorySoundActive: boolean;
  onToggleStorySound: () => void;
  activeReadingBookTitle?: string;
  onOpenReader?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentRole,
  profile,
  onOpenProfile,
  activeTab,
  onSelectTab,
  notifications,
  onMarkNotificationRead,
  onToggleRox,
  isRoxOpen,
  isStorySoundActive,
  onToggleStorySound,
  activeReadingBookTitle,
  onOpenReader
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNavLinks = () => {
    if (currentRole === 'reader') {
      return [
        { id: 'discover', label: 'Discover & Browse' },
        { id: 'library', label: 'My Library' },
        { id: 'progress', label: 'Reading Progress' },
        { id: 'favorites', label: 'Wishlist & Favorites' },
        { id: 'subscriptions', label: 'Novelia Pass' }
      ];
    }
    if (currentRole === 'publisher') {
      return [
        { id: 'pub-overview', label: 'Publisher Dashboard' },
        { id: 'pub-catalog', label: 'Book Catalog' },
        { id: 'pub-analytics', label: 'Reader Analytics' },
        { id: 'pub-earnings', label: 'Earnings & Royalties' },
        { id: 'pub-campaigns', label: 'Reach Readers' }
      ];
    }
    return [
      { id: 'admin-overview', label: 'Operations Hub' },
      { id: 'admin-publishers', label: 'Publishers Queue' },
      { id: 'admin-books', label: 'Book Moderation' },
      { id: 'admin-campaigns', label: 'Campaign Approvals' },
      { id: 'admin-community', label: 'Community Moderation' }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="border-b border-amber-100/90 bg-white/95 sticky top-10 z-40 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab(navLinks[0].id)}
          className="text-left group flex items-baseline gap-2 shrink-0 cursor-pointer"
        >
          <span className="font-serif text-2xl font-bold tracking-wider text-[#0D5EAF] group-hover:text-[#094787] transition-colors">
            NOVELIA
          </span>
          <span className="hidden lg:inline text-[11px] font-sans tracking-widest text-amber-600/80 uppercase font-semibold">
            Global Literature
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single-Line, 4-5 concise tabs) */}
        <nav className="hidden md:flex items-center gap-7 overflow-x-auto py-1">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#0D5EAF] font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5EAF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick Resume Book if active */}
          {activeReadingBookTitle && onOpenReader && currentRole === 'reader' && (
            <button
              onClick={onOpenReader}
              title={`Resume reading ${activeReadingBookTitle}`}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 text-xs text-[#0D5EAF] font-medium transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span className="truncate max-w-[120px]">Resume: {activeReadingBookTitle}</span>
            </button>
          )}

          {/* StorySound Quick Toggle (Only available for reader and publisher) */}
          {(currentRole === 'reader' || currentRole === 'publisher') && (
            <button
              onClick={onToggleStorySound}
              title={isStorySoundActive ? "Pause StorySound ambient music" : "Play StorySound ambient music"}
              className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                isStorySoundActive
                  ? 'bg-sky-50 border-sky-300 text-[#0D5EAF]'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isStorySoundActive ? 'animate-pulse text-[#0D5EAF]' : ''}`} />
              <span className="hidden sm:inline font-mono text-[11px]">StorySound</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0D5EAF] text-white font-bold text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Mobile backdrop to easily dismiss notifications on tap outside */}
                <div
                  className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[1px] sm:hidden"
                  onClick={() => setShowNotifications(false)}
                  aria-hidden="true"
                />

                <div className="fixed left-3 right-3 top-20 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-sm sm:max-w-none mx-auto sm:mx-0 bg-white border border-stone-200/90 rounded-3xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
                        Notifications & Alerts
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#0D5EAF] text-white text-[10px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            notifications.forEach(n => {
                              if (!n.read) onMarkNotificationRead(n.id);
                            });
                          }}
                          className="text-[11px] text-[#0D5EAF] hover:underline font-medium cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                        title="Close notifications"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-stone-100 max-h-[60vh] sm:max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-stone-500">
                        <Bell className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                        <p className="text-xs font-medium">No new notifications</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div
                          key={item.id}
                          className={`py-3 px-2.5 flex items-start justify-between gap-3 hover:bg-stone-50 rounded-xl transition-colors ${
                            !item.read ? 'bg-amber-50/60 border-l-2 border-[#0D5EAF]' : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-1">
                            <p className="text-xs font-semibold text-stone-900 truncate">{item.title}</p>
                            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed break-words">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-stone-400 mt-1 block font-mono">
                              {item.date}
                            </span>
                          </div>
                          {!item.read && (
                            <button
                              onClick={() => onMarkNotificationRead(item.id)}
                              className="p-1.5 text-stone-400 hover:text-[#0D5EAF] hover:bg-sky-50 rounded-lg shrink-0 cursor-pointer transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-[#0D5EAF]" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Primary Action: ROX AI Assistant Button in Greece Blue */}
          <button
            onClick={onToggleRox}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isRoxOpen
                ? 'bg-[#0D5EAF] text-white shadow-md ring-2 ring-sky-300'
                : 'bg-[#0D5EAF] hover:bg-[#094787] text-white shadow-xs'
            }`}
          >
            <Bot className="w-4 h-4 text-white" />
            <span className="whitespace-nowrap hidden sm:inline">ROX AI</span>
          </button>

          {/* Logged-in User Profile Section Button (PRD Requirement) */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-stone-50 hover:bg-amber-50/80 border border-stone-200/90 hover:border-amber-300/80 transition-all cursor-pointer shadow-2xs group"
            title={`Logged in as ${profile.name} (${profile.userId}) — Click to view profile details`}
          >
            <div className={`w-6 h-6 rounded-full ${profile.avatarColor} text-white font-serif font-bold text-[10px] flex items-center justify-center shadow-xs`}>
              {profile.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-semibold text-stone-900 group-hover:text-[#0D5EAF] transition-colors truncate max-w-[85px]">
                  {profile.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#0D5EAF] bg-sky-50 px-1 py-0.2 rounded border border-sky-100">
                  {profile.userId.split('-')[2]}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center gap-4 px-4 py-2 border-t border-stone-100 overflow-x-auto bg-white">
        {navLinks.map(link => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`text-xs font-medium whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                isActive ? 'text-[#0D5EAF] font-bold border-b-2 border-[#0D5EAF]' : 'text-stone-600'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
