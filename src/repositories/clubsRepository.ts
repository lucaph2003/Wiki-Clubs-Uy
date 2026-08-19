import type { Club, ClubSummary, Slug } from '@/domain/types';
import { clubSchema } from '@/domain/schemas';
import { NotFoundError, SchemaError } from './errors';

const modules = import.meta.glob<{ default: unknown }>('../data/clubs/*.json');
const cache = new Map<Slug, Club>();
let summaryCache: ClubSummary[] | null = null;

function slugFromPath(path: string): Slug {
  const match = /([^/]+)\.json$/.exec(path);
  if (!match?.[1]) throw new SchemaError(`Ruta de club inesperada: ${path}`);
  return match[1];
}

function parseClub(raw: unknown, slug: Slug): Club {
  if (!import.meta.env.DEV) return raw as Club;
  const result = clubSchema.safeParse(raw);
  if (!result.success) {
    throw new SchemaError(`Club inválido (${slug}): ${result.error.message}`);
  }
  return result.data as Club;
}

function toSummary(club: Club): ClubSummary {
  return {
    slug: club.slug,
    name: club.name,
    shortName: club.shortName,
    nickname: club.nickname,
    foundedYear: club.foundedYear,
    city: club.city,
    crest: club.crest,
    identity: { colors: club.identity.colors },
    stature: club.stature,
    division: club.division,
  };
}

export async function getClubs(): Promise<ClubSummary[]> {
  if (summaryCache) return summaryCache;

  const summaries = await Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      const slug = slugFromPath(path);
      const raw = (await loader()).default;
      const club = parseClub(raw, slug);
      cache.set(slug, club);
      return toSummary(club);
    }),
  );

  summaryCache = summaries;
  return summaries;
}

export async function getClub(slug: Slug): Promise<Club> {
  const cached = cache.get(slug);
  if (cached) return cached;

  const loader = modules[`../data/clubs/${slug}.json`];
  if (!loader) throw new NotFoundError(`Club no encontrado: ${slug}`);

  const raw = (await loader()).default;
  const club = parseClub(raw, slug);
  cache.set(slug, club);
  return club;
}

/** Se llama en hover/touchstart para que el Portal aterrice con datos listos. */
export function prefetchClub(slug: Slug): void {
  void getClub(slug).catch(() => {});
}
