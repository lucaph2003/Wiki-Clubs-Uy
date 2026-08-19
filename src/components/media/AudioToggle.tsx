import { useAudioStore } from '@/stores/audioStore';

/** Control global de audio, visible siempre en la esquina inferior (§10.2, P5). Sin emojis (§P7). */
export function AudioToggle(): React.ReactElement {
  const enabled = useAudioStore((s) => s.enabled);
  const nowPlayingTitle = useAudioStore((s) => s.nowPlayingTitle);
  const setEnabled = useAudioStore((s) => s.setEnabled);

  const label =
    enabled && nowPlayingTitle ? `Silenciar: sonando ${nowPlayingTitle}` : enabled ? 'Silenciar ambiente' : 'Activar ambiente sonoro';

  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-club-border bg-club-surface-2 text-club-ink shadow-lg transition-colors duration-[var(--motion-fast)] ease-club hover:bg-club-surface-3"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6h4l5 5V4L8 9H4Z" />
        {enabled ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="m17 9 4 6m0-6-4 6" />
        )}
      </svg>
    </button>
  );
}
