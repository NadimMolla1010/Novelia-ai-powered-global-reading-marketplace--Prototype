import { StorySoundMood } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private currentMood: StorySoundMood | null = null;
  private isAudioPlaying = false;
  private volume = 0.45;
  private loopTimer: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  public getMood(): StorySoundMood | null {
    return this.currentMood;
  }

  public startMood(mood: StorySoundMood) {
    this.initContext();
    this.stop();

    if (!this.ctx || !this.masterGain) return;
    this.currentMood = mood;
    this.isAudioPlaying = true;

    switch (mood) {
      case 'peaceful':
        this.playPeacefulSoundscape();
        break;
      case 'reflective':
        this.playReflectiveSoundscape();
        break;
      case 'mystery':
        this.playMysterySoundscape();
        break;
      case 'romantic':
        this.playRomanticSoundscape();
        break;
      case 'action':
        this.playActionSoundscape();
        break;
    }
  }

  public stop() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // ignore already stopped nodes
      }
    });
    this.activeNodes = [];
    this.isAudioPlaying = false;
    this.currentMood = null;
  }

  // Mood 1: Peaceful (Gentle pentatonic pads with soft rain air texture)
  private playPeacefulSoundscape() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Ambient noise generator (soft rain/forest air)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // pink-like filter
      lastOut = data[i];
      data[i] *= 0.12;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(650, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise);

    // Harmonic chords cycle
    const chords = [
      [220.0, 261.63, 329.63, 392.0], // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 392.0], // G
      [130.81, 196.0, 261.63, 329.63], // Cmaj7
    ];

    let chordIndex = 0;
    const playChord = () => {
      if (!this.isAudioPlaying || !this.ctx || !this.masterGain) return;
      const notes = chords[chordIndex % chords.length];
      chordIndex++;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + i * 150, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.045 / (i + 1), ctx.currentTime + 2.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 5.8);
      });
    };

    playChord();
    this.loopTimer = setInterval(playChord, 5200);
  }

  // Mood 2: Reflective (Muted piano & cello chords in D minor)
  private playReflectiveSoundscape() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Sub drone
    const droneOsc = ctx.createOscillator();
    droneOsc.type = 'triangle';
    droneOsc.frequency.setValueAtTime(73.42, ctx.currentTime); // D2

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(220, ctx.currentTime);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.08, ctx.currentTime);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start();
    this.activeNodes.push(droneOsc);

    const motifs = [
      [146.83, 220.0, 261.63, 349.23], // Dm9
      [110.0, 164.81, 220.0, 261.63], // Am7
      [116.54, 174.61, 220.0, 293.66], // Bbmaj7
      [130.81, 196.0, 246.94, 329.63], // C add9
    ];

    let step = 0;
    const trigger = () => {
      if (!this.isAudioPlaying || !this.ctx || !this.masterGain) return;
      const chord = motifs[step % motifs.length];
      step++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2 + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 6.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + 6.5);
      });
    };

    trigger();
    this.loopTimer = setInterval(trigger, 6200);
  }

  // Mood 3: Mystery (Suspenseful ambient noir drone & harmonics)
  private playMysterySoundscape() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const baseOsc = ctx.createOscillator();
    baseOsc.type = 'sawtooth';
    baseOsc.frequency.setValueAtTime(55.0, ctx.currentTime); // A1

    const baseFilter = ctx.createBiquadFilter();
    baseFilter.type = 'lowpass';
    baseFilter.frequency.setValueAtTime(140, ctx.currentTime);

    const baseGain = ctx.createGain();
    baseGain.gain.setValueAtTime(0.09, ctx.currentTime);

    baseOsc.connect(baseFilter);
    baseFilter.connect(baseGain);
    baseGain.connect(this.masterGain);
    baseOsc.start();
    this.activeNodes.push(baseOsc);

    // Eerie LFO shimmer
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(40, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(baseFilter.frequency);
    lfo.start();
    this.activeNodes.push(lfo);

    const eerieNotes = [110.0, 123.47, 130.81, 164.81, 207.65];
    let noteIdx = 0;
    const playChime = () => {
      if (!this.isAudioPlaying || !this.ctx || !this.masterGain) return;
      const freq = eerieNotes[noteIdx % eerieNotes.length];
      noteIdx++;

      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      bellGain.gain.setValueAtTime(0.001, ctx.currentTime);
      bellGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.4);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.2);

      bell.connect(bellGain);
      bellGain.connect(this.masterGain!);
      bell.start(ctx.currentTime);
      bell.stop(ctx.currentTime + 4.5);
    };

    playChime();
    this.loopTimer = setInterval(playChime, 4500);
  }

  // Mood 4: Romantic (Soft lush piano and warm tremolo strings)
  private playRomanticSoundscape() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 277.18, 329.63, 440.0], // A add9
      [174.61, 220.0, 261.63, 349.23], // Fmaj7
      [196.0, 246.94, 293.66, 392.0], // G
    ];

    let chordIdx = 0;
    const playArp = () => {
      if (!this.isAudioPlaying || !this.ctx || !this.masterGain) return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.8 + idx * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.8);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(ctx.currentTime + idx * 0.2);
        osc.stop(ctx.currentTime + 5.0);
      });
    };

    playArp();
    this.loopTimer = setInterval(playArp, 4800);
  }

  // Mood 5: Action (Cinematic instrumental pulse)
  private playActionSoundscape() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    let beat = 0;
    const playPulse = () => {
      if (!this.isAudioPlaying || !this.ctx || !this.masterGain) return;
      const isAccent = beat % 4 === 0;
      beat++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isAccent ? 55 : 65.41, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isAccent ? 350 : 200, ctx.currentTime);

      gain.gain.setValueAtTime(isAccent ? 0.08 : 0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    };

    playPulse();
    this.loopTimer = setInterval(playPulse, 700);
  }
}

export const soundEngine = new SoundEngine();
