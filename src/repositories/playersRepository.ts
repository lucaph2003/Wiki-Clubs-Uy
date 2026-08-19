import type { SquadPlayer } from '@/domain/types';
import { getClub } from './clubsRepository';
import { NotFoundError } from './errors';

/** Fase 1: los jugadores viven embebidos en `Club.squad`, no en archivos propios. */
export async function getPlayer(clubSlug: string, playerId: string): Promise<SquadPlayer> {
  const club = await getClub(clubSlug);
  const player = club.squad.find((p) => p.id === playerId);
  if (!player) throw new NotFoundError(`Jugador no encontrado: ${clubSlug}/${playerId}`);
  return player;
}
