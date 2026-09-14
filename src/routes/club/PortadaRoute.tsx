import { Link, useOutletContext } from 'react-router';
import { EditorialNotice } from '@/components/ui/EditorialNotice';
import { formatYear } from '@/lib/format';
import type { Club } from '@/domain/types';

const SECTIONS = [
  { to: 'espacios', title: 'Experiencia y Espacios', body: 'El barrio, la sede, el estadio.' },
  { to: 'identidad', title: 'Identidad y Mística', body: 'Camisetas, cánticos, línea de tiempo.' },
  { to: 'institucion', title: 'Datos Institucionales', body: 'Plantel, ventas, autoridades, balances.' },
];

export function PortadaRoute(): React.ReactElement {
  const club = useOutletContext<Club>();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <EditorialNotice meta={club.meta} />
      <section className="mb-10">
        <p className="text-club-ink-muted">{club.city} · {formatYear(club.foundedYear)}</p>
        <h2 className="mt-1 text-2xl font-bold">{club.nickname}</h2>
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className="rounded-2xl border border-club-border bg-club-surface-2 p-5 transition-colors duration-[var(--motion-base)] ease-club hover:bg-club-surface-3"
          >
            <h3 className="font-semibold text-club-primary-readable">{section.title}</h3>
            <p className="mt-1 text-sm text-club-ink-muted">{section.body}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
