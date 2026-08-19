/** Falla rápido con un mensaje claro cuando una precondición no se cumple. */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
