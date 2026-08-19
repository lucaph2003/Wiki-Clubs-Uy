import { useEffect, useRef, type ReactNode } from 'react';
import { useAudioStore } from '@/stores/audioStore';

const FADE_IN_MS = 800;
const FADE_OUT_MS = 400;

/** Canal único de audio ambiente (§10.2). Ningún otro componente crea instancias de `<audio>` sueltas. */
export function AudioProvider({ children }: { children: ReactNode }): ReactNode {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enabled = useAudioStore((s) => s.enabled);
  const volume = useAudioStore((s) => s.volume);
  const nowPlaying = useAudioStore((s) => s.nowPlaying);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onVisibilityChange = (): void => {
      if (document.hidden) audio.pause();
      else if (enabled && nowPlaying) void audio.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [enabled, nowPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!enabled || !nowPlaying) {
      fadeTo(audio, 0, FADE_OUT_MS);
      return;
    }

    if (audio.src !== nowPlaying) audio.src = nowPlaying;
    void audio.play().catch(() => {});
    fadeTo(audio, volume, FADE_IN_MS);
  }, [enabled, nowPlaying, volume]);

  return children;
}

function fadeTo(audio: HTMLAudioElement, target: number, durationMs: number): void {
  const start = audio.volume;
  const startTime = performance.now();

  const step = (now: number): void => {
    const t = Math.min(1, (now - startTime) / durationMs);
    audio.volume = start + (target - start) * t;
    if (t < 1) requestAnimationFrame(step);
    else if (target === 0) audio.pause();
  };
  requestAnimationFrame(step);
}
