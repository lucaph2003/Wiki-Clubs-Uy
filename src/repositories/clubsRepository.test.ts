import { describe, expect, it } from 'vitest';
import { getClub, getClubs } from './clubsRepository';
import { getDerbies } from './derbiesRepository';

describe('clubsRepository', () => {
  it('lista los clubes del catálogo mock', async () => {
    const clubs = await getClubs();
    expect(clubs.length).toBeGreaterThanOrEqual(3);
    expect(clubs.map((c) => c.slug)).toContain('penarol');
  });

  it('carga un club completo por slug', async () => {
    const club = await getClub('penarol');
    expect(club.shortName).toBe('Peñarol');
  });

  it('lanza NotFoundError para un slug inexistente', async () => {
    await expect(getClub('no-existe')).rejects.toThrow('Club no encontrado');
  });
});

describe('derbiesRepository', () => {
  it('lista los clásicos y valida contra el schema', async () => {
    const derbies = await getDerbies();
    expect(derbies.length).toBeGreaterThanOrEqual(1);
  });
});
