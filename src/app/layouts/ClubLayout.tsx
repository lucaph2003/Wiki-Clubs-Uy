import { Outlet, useLoaderData, useParams, type LoaderFunctionArgs } from 'react-router';
import { useEffect, useLayoutEffect } from 'react';
import { useSkinStore } from '@/stores/skinStore';
import { useAudioStore } from '@/stores/audioStore';
import { buildSkin } from '@/domain/logic/skin';
import { getClub } from '@/repositories/clubsRepository';
import { ClubHeader } from '@/features/club-identity/ClubHeader';
import { invariant } from '@/lib/invariant';
import type { Club } from '@/domain/types';

export async function clubLoader({ params }: LoaderFunctionArgs): Promise<Club> {
  invariant(params.slug, 'Falta el slug del club en la URL');
  return getClub(params.slug);
}

export function ClubLayout(): React.ReactElement {
  const club = useLoaderData<Club>();
  const apply = useSkinStore((s) => s.apply);
  const audioEnabled = useAudioStore((s) => s.enabled);
  const setNowPlaying = useAudioStore((s) => s.setNowPlaying);
  const { slug } = useParams();

  useLayoutEffect(() => {
    apply(buildSkin(club));
    document.title = `${club.shortName} — Garra`;
  }, [club, apply]);

  useEffect(() => {
    const ambient = club.identity.chants.find((c) => c.loopable);
    if (audioEnabled && ambient) setNowPlaying(ambient.audio.src, ambient.title);
    return () => setNowPlaying(null);
  }, [club, audioEnabled, setNowPlaying]);

  return (
    <div key={slug} className="min-h-dvh">
      <ClubHeader club={club} />
      <Outlet context={club} />
    </div>
  );
}
