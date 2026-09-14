import type { RecordMeta } from '@/domain/types';

export interface EditorialNoticeProps {
  meta: RecordMeta;
}

/** Explicita que una ficha mock todavía no debe leerse como publicación editorial definitiva. */
export function EditorialNotice({ meta }: EditorialNoticeProps): React.ReactElement | null {
  if (meta.editorialStatus === 'published' && meta.completeness >= 1) return null;

  return (
    <aside className="rounded-xl border border-club-border bg-club-surface-2 px-4 py-3 text-sm text-club-ink-muted" aria-label="Estado editorial">
      Ficha en preparación: algunos datos, créditos o licencias pueden estar pendientes de verificación.
    </aside>
  );
}
