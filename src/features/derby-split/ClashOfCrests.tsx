import { ScrollScene } from '@/components/motion/ScrollScene';
import type { DerbySide } from '@/domain/types';

export function ClashOfCrests({ left, right }: { left: DerbySide; right: DerbySide }): React.ReactElement {
  return (
    <ScrollScene className="flex items-center justify-center gap-8 py-16">
      {({ progress }) => (
        <>
          <img
            src={left.crest.src}
            alt={left.crest.alt}
            width={96}
            height={96}
            className="h-24 w-24"
            style={{
              transform: `translateX(${(1 - progress) * -120}px)`,
              opacity: progress,
              transition: 'transform 0ms, opacity 0ms',
            }}
          />
          <div
            className="h-16 w-16 rounded-full"
            style={{ backgroundColor: 'var(--club-glow)', opacity: progress, transform: `scale(${0.5 + progress * 0.5})` }}
          />
          <img
            src={right.crest.src}
            alt={right.crest.alt}
            width={96}
            height={96}
            className="h-24 w-24"
            style={{
              transform: `translateX(${(1 - progress) * 120}px)`,
              opacity: progress,
            }}
          />
        </>
      )}
    </ScrollScene>
  );
}
