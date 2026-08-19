import { Link, NavLink } from 'react-router';
import type { Club } from '@/domain/types';

const TABS: { to: string; label: string; end: boolean }[] = [
  { to: '', label: 'Portada', end: true },
  { to: 'espacios', label: 'Espacios', end: false },
  { to: 'identidad', label: 'Identidad', end: false },
  { to: 'institucion', label: 'Institución', end: false },
];

export function ClubHeader({ club }: { club: Club }): React.ReactElement {
  return (
    <header className="border-b border-club-border bg-club-surface-2">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link
          to="/"
          aria-label="Volver a la grilla"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-club-ink-muted transition-colors duration-[var(--motion-fast)] ease-club hover:bg-club-surface-3 hover:text-club-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-focus"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <img
          src={club.crest.src}
          alt={club.crest.alt}
          width={40}
          height={40}
          style={{ viewTransitionName: 'club-portal' }}
          className="h-10 w-10"
        />
        <div>
          <h1 className="font-semibold leading-tight">{club.name}</h1>
          <p className="text-xs text-club-ink-muted">{club.nickname}</p>
        </div>
      </div>
      <nav aria-label="Secciones del club" className="mx-auto flex max-w-6xl gap-1 px-4 pb-2">
        {TABS.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `min-h-11 rounded-full px-4 py-2 text-sm transition-colors duration-[var(--motion-fast)] ease-club ${
                isActive ? 'bg-club-primary text-club-on-primary' : 'text-club-ink-muted hover:text-club-ink'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
