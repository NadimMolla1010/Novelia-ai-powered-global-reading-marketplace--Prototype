import React, { useState, useEffect } from 'react';
import { StorySoundMood } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Volume2, VolumeX, Play, Pause, Sliders, ChevronDown, Minimize2, Maximize2, Music } from 'lucide-react';

interface StorySoundBarProps {
  currentMood: StorySoundMood;
  onChangeMood: (mood: StorySoundMood) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  trackTitle?: string;
}

export const StorySoundBar: React.FC<StorySoundBarProps> = ({
  currentMood,
  onChangeMood,
  isPlaying,
  onTogglePlay,
  trackTitle
}) => {
  const [volume, setVolume] = useState(soundEngine.getVolume());
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([40, 60, 30, 80, 50, 70, 45, 90]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 70) + 20)
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
    if (newVol > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      soundEngine.setVolume(volume);
      setIsMuted(false);
    } else {
      soundEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  const moods: { id: StorySoundMood; name: string; desc: string; icon: string }[] = [
    { id: 'reflective', name: 'Reflective', desc: 'Acoustic piano & cello chords', icon: '🎹' },
    { id: 'peaceful', name: 'Peaceful', desc: 'Pentatonic pads & rain breeze', icon: '🍃' },
    { id: 'mystery', name: 'Mystery Noir', desc: 'Sub-harmonic ambient drone', icon: '🕯️' },
    { id: 'romantic', name: 'Romantic', desc: 'Gentle lush major 7th strings', icon: '✨' },
    { id: 'action', name: 'Cinematic', desc: 'Driving rhythmic pulse', icon: '⚡' }
  ];

  const currentMoodObj = moods.find(m => m.id === currentMood);

  // Minimized side-docked widget view
  if (isMinimized) {
    return (
      <aside
        aria-label="StorySound minimized player"
        className="fixed bottom-4 left-4 z-40 bg-white/95 border border-stone-200/90 backdrop-blur-md rounded-2xl shadow-xl p-2 flex items-center gap-2.5 text-stone-800 transition-all duration-300 hover:shadow-2xl hover:border-sky-300 animate-in fade-in slide-in-from-bottom-2"
      >
        {/* Quick Play / Pause */}
        <button
          onClick={onTogglePlay}
          className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-[#0D5EAF] text-white shadow-md shadow-blue-500/20'
              : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200'
          }`}
          title={isPlaying ? 'Pause StorySound' : 'Play StorySound'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        {/* Minimized Content & Maximize Button */}
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 pr-1 text-left cursor-pointer group"
          title="Click to restore StorySound player"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#0D5EAF] font-bold flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
              StorySound™
            </span>
            <span className="text-[11px] font-semibold text-stone-900 capitalize truncate max-w-[110px]">
              {currentMoodObj?.icon} {currentMood}
            </span>
          </div>

          {isPlaying && (
            <div className="flex items-end gap-0.5 h-4 px-1">
              {waveHeights.slice(0, 4).map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#0D5EAF] rounded-full transition-all duration-150"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          )}

          <div
            className="p-1.5 rounded-lg text-stone-400 group-hover:text-[#0D5EAF] group-hover:bg-sky-50 transition-colors ml-1"
            title="Expand player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </button>
      </aside>
    );
  }

  // Full Expanded Player View
  return (
    <aside
      aria-label="StorySound music player"
      className="fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md bg-white/95 border border-stone-200/90 backdrop-blur-md rounded-2xl shadow-xl p-3 text-stone-800 transition-all duration-300 animate-in fade-in"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-[#0D5EAF] text-white shadow-md shadow-blue-500/20'
              : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200'
          }`}
          title={isPlaying ? 'Pause StorySound' : 'Play StorySound'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Track / Mood Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#0D5EAF] font-bold">
              StorySound™
            </span>
            <span className="text-stone-300 text-[10px]">·</span>
            <span className="text-[11px] font-medium text-stone-600 capitalize truncate">
              {currentMoodObj?.icon} {currentMood} Mood
            </span>
          </div>
          <p className="text-xs font-semibold text-stone-900 truncate mt-0.5">
            {trackTitle || `${currentMoodObj?.name} Soundscape`}
          </p>
        </div>

        {/* Visual Wave Equalizer */}
        {isPlaying && (
          <div className="flex items-end gap-1 h-5 px-1">
            {waveHeights.slice(0, 5).map((height, i) => (
              <div
                key={i}
                className="w-1 bg-[#0D5EAF] rounded-full transition-all duration-150"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        )}

        {/* Volume, Mood Settings & Minimize Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isExpanded
                ? 'bg-sky-50 text-[#0D5EAF]'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
            title="Adjust atmosphere and volume"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-stone-500 hover:text-[#0D5EAF] rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title="Minimize to side"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-stone-100 animate-in fade-in slide-in-from-top-1">
          {/* Volume slider */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-stone-500 w-12 font-mono">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1 accent-[#0D5EAF] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-stone-600 font-mono w-8 text-right font-medium">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Mood Selector Buttons */}
          <div>
            <p className="text-[11px] text-stone-500 mb-1.5 font-medium">Select Chapter Atmosphere:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {moods.map(m => {
                const isSelected = currentMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onChangeMood(m.id);
                      if (!isPlaying) onTogglePlay();
                    }}
                    className={`p-2 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-[#0D5EAF] text-[#0D5EAF] ring-1 ring-[#0D5EAF]/20'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                      <span>{m.icon}</span>
                      <span>{m.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block truncate mt-0.5">
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
