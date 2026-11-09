import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  User,
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Wallet,
  Lock,
  Sparkles,
  X,
  Check,
  CreditCard,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onUpdateBio?: (newBio: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentRole,
  onSwitchRole,
  onUpdateBio
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profile.bio);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveBio = () => {
    if (onUpdateBio) onUpdateBio(bioText);
    setIsEditingBio(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-900">
        {/* Warm Sunlight Header Band */}
        <div className="relative bg-gradient-to-r from-amber-50 via-sky-50 to-amber-100/40 p-6 border-b border-stone-200/80">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar Circle with Sunlight Halo */}
            <div className="relative">
              <div className={`w-18 h-18 rounded-2xl ${profile.avatarColor} text-white flex items-center justify-center text-2xl font-serif font-bold shadow-md ring-4 ring-white`}>
                {profile.name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0D5EAF]" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  {profile.name}
                </h2>
                <span className="text-xs text-stone-500 font-mono">
                  {profile.handle}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0D5EAF] text-white text-[10px] font-mono font-bold tracking-wide shadow-2xs">
                  {profile.userId}
                </span>
              </div>

              <p className="text-xs text-[#0D5EAF] font-semibold mt-0.5">
                {profile.status}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-stone-500 font-sans">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0D5EAF]" />
                  <span>{profile.city}, {profile.country}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Member since {profile.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Scrollable Profile Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Account Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-stone-200/90 shadow-2xs">
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0D5EAF]" />
                <span>Primary Email</span>
              </span>
              <p className="font-semibold text-stone-900 mt-1 truncate">
                {profile.email}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-stone-200/90 shadow-2xs">
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Security & Verification</span>
              </span>
              <p className="font-semibold text-stone-900 mt-1 truncate">
                {profile.securityBadge || 'Verified 2FA Secured'}
              </p>
            </div>

            {profile.walletBalanceUSD !== undefined && (
              <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-stone-200/90 shadow-2xs">
                <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Novelia Credit Balance</span>
                </span>
                <p className="font-mono font-bold text-emerald-700 mt-1 text-sm">
                  ${profile.walletBalanceUSD.toFixed(2)} USD
                </p>
              </div>
            )}

            {profile.subscriptionTier && (
              <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-stone-200/90 shadow-2xs">
                <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reader Membership</span>
                </span>
                <p className="font-semibold text-[#0D5EAF] mt-1 truncate">
                  {profile.subscriptionTier}
                </p>
              </div>
            )}

            {profile.organization && (
              <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-stone-200/90 shadow-2xs">
                <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0D5EAF]" />
                  <span>Publishing House / Entity</span>
                </span>
                <p className="font-semibold text-stone-900 mt-1 truncate">
                  {profile.organization}
                </p>
              </div>
            )}

            {profile.payoutMethod && (
              <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-stone-200/90 shadow-2xs">
                <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Payout Channel</span>
                </span>
                <p className="font-semibold text-stone-900 mt-1 truncate">
                  {profile.payoutMethod}
                </p>
              </div>
            )}
          </div>

          {/* Bio / Persona Statement */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
                Biography & Profile Statement
              </span>
              {!isEditingBio ? (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-[11px] text-[#0D5EAF] hover:underline font-medium cursor-pointer"
                >
                  Edit Bio
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="text-[11px] text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="px-2.5 py-0.5 rounded-md bg-[#0D5EAF] text-white text-[11px] font-semibold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditingBio ? (
              <textarea
                rows={3}
                value={bioText}
                onChange={e => setBioText(e.target.value)}
                className="w-full p-2.5 bg-[#fcfaf5] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#0D5EAF]"
              />
            ) : (
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {bioText}
              </p>
            )}
          </div>

          {/* Preferred Languages (BR-15 multilingual support) */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
              <Globe className="w-3.5 h-3.5 text-[#0D5EAF]" />
              <span>Configured Reading & Publishing Languages</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {profile.preferredLanguages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200/80 text-xs font-medium text-[#0D5EAF]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Reading Interests or Editorial Shelves */}
          {profile.readingInterests && (
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Preferred Genres & Editorial Shelves</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {profile.readingInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-medium text-amber-900"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Persona Quick Switcher within Profile Modal */}
          <div className="pt-2 border-t border-stone-200">
            <span className="text-xs font-semibold text-stone-700 block mb-2">
              Switch Active Demo Persona:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onSwitchRole('reader');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  currentRole === 'reader'
                    ? 'bg-[#0D5EAF] text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <span className="font-semibold block">Global Reader</span>
                <span className={`text-[10px] block mt-0.5 ${currentRole === 'reader' ? 'text-sky-200' : 'text-stone-400'}`}>
                  Elena Rostova
                </span>
              </button>

              <button
                onClick={() => {
                  onSwitchRole('publisher');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  currentRole === 'publisher'
                    ? 'bg-[#0D5EAF] text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <span className="font-semibold block">Publisher Portal</span>
                <span className={`text-[10px] block mt-0.5 ${currentRole === 'publisher' ? 'text-sky-200' : 'text-stone-400'}`}>
                  Marcus Sterling
                </span>
              </button>

              <button
                onClick={() => {
                  onSwitchRole('admin');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-[#0D5EAF] text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <span className="font-semibold block">Platform Admin</span>
                <span className={`text-[10px] block mt-0.5 ${currentRole === 'admin' ? 'text-sky-200' : 'text-stone-400'}`}>
                  Alexandra Thorne
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-[#fcfaf5] flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono text-[11px]">
            User ID: <strong>{profile.userId}</strong> · Verified NOVELIA Account
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors shadow-2xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
