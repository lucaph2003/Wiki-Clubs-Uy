import { useLayoutEffect } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { NotFoundError } from '@/repositories/errors';
import { useSkinStore } from '@/stores/skinStore';

/** Error de loader skinneado: evita exponer la pantalla por defecto del router. */
export function RouteError(): React.ReactElement {
  const error = useRouteError();
  const resetSkin = useSkinStore((s) => s.reset);
  const isMissing = (isRouteErrorResponse(error) && error.status === 404) || error instanceof NotFoundError;

  useLayoutEffect(() => {
    resetSkin();
    document.title = isMissing ? 'No encontrado — Garra' : 'Error — Garra';
  }, [isMissing, resetSkin]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">{isMissing ? 'Esto no existe' : 'No pudimos cargar esta página'}</h1>
      <p className="text-club-ink-muted">
        {isMissing ? 'La página que buscás no está en la cancha.' : 'Probá de nuevo o volvé al inicio.'}
      </p>
      <Link to="/" className="text-club-primary-readable underline">
        Volver al inicio
      </Link>
    </main>
  );
}
