import { useLayoutEffect } from 'react';
import { Link } from 'react-router';

export function NotFoundRoute(): React.ReactElement {
  useLayoutEffect(() => {
    document.title = 'No encontrado — Garra';
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Esto no existe</h1>
      <p className="text-club-ink-muted">La página que buscás no está en la cancha.</p>
      <Link to="/" className="text-club-primary-readable underline">
        Volver al inicio
      </Link>
    </main>
  );
}
