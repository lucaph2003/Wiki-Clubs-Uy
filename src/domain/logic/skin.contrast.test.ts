import { describe, expect, it } from 'vitest';
import { getClubs } from '@/repositories/clubsRepository';
import { buildSkin } from './skin';
import { contrastRatio } from '@/lib/color';

const PAIRS: [ink: string, bg: string, min: number][] = [
  ['--club-ink', '--club-surface', 4.5],
  ['--club-primary-readable', '--club-surface', 4.5],
  ['--club-on-primary', '--club-primary', 4.5],
  ['--club-on-secondary', '--club-secondary', 4.5],
  ['--club-focus', '--club-surface', 3],
];

describe('skin contrast (WCAG AA)', async () => {
  const clubs = await getClubs();
  for (const club of clubs) {
    const { tokens } = buildSkin(club);
    for (const [ink, bg, min] of PAIRS) {
      it(`${club.slug}: ${ink} sobre ${bg} ≥ ${min}:1`, () => {
        expect(contrastRatio(tokens[ink]!, tokens[bg]!)).toBeGreaterThanOrEqual(min);
      });
    }
  }
});
