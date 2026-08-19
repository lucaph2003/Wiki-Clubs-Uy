import type { Derby, Slug } from '@/domain/types';
import { derbySchema } from '@/domain/schemas';
import { NotFoundError, SchemaError } from './errors';

const modules = import.meta.glob<{ default: unknown }>('../data/derbies/*.json');
const cache = new Map<Slug, Derby>();

function parseDerby(raw: unknown, slug: Slug): Derby {
  if (!import.meta.env.DEV) return raw as Derby;
  const result = derbySchema.safeParse(raw);
  if (!result.success) {
    throw new SchemaError(`Clásico inválido (${slug}): ${result.error.message}`);
  }
  return result.data as Derby;
}

export async function getDerbies(): Promise<Derby[]> {
  return Promise.all(
    Object.entries(modules).map(async ([path, loader]) => {
      const match = /([^/]+)\.json$/.exec(path);
      const slug = match?.[1] ?? path;
      const raw = (await loader()).default;
      const derby = parseDerby(raw, slug);
      cache.set(slug, derby);
      return derby;
    }),
  );
}

export async function getDerby(slug: Slug): Promise<Derby> {
  const cached = cache.get(slug);
  if (cached) return cached;

  const loader = modules[`../data/derbies/${slug}.json`];
  if (!loader) throw new NotFoundError(`Clásico no encontrado: ${slug}`);

  const raw = (await loader()).default;
  const derby = parseDerby(raw, slug);
  cache.set(slug, derby);
  return derby;
}
