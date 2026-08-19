/**
 * Stub para el día que exista una API real. Hoy no se usa: los repositorios leen
 * `src/data/*.json` vía `import.meta.glob`. Mantiene la forma async para que la
 * migración a fetch real sea mecánica (ver agents.md §3).
 */
export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return (await res.json()) as T;
}
