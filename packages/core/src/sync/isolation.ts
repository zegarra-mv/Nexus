/**
 * Project isolation for CLAUDE.md sync.
 *
 * A project tagged with one of ISOLATION_TAGS is kept apart from the rest of
 * the portfolio, in both directions:
 *  - other projects never see it (portfolio map, cross-project notes)
 *  - its own CLAUDE.md shows only itself
 *
 * Use it for work that must not mix with anything else (a separate company,
 * a confidential client).
 */

export const ISOLATION_TAGS: ReadonlySet<string> = new Set(['separado', 'separate', 'isolated']);

export function isIsolated(tags: readonly string[] | undefined): boolean {
  return (tags ?? []).some((t) => ISOLATION_TAGS.has(t.trim().toLowerCase()));
}

/**
 * The projects that the given project may see during sync, itself included.
 */
export function visibleProjects<T extends { id: string; tags?: string[] | undefined }>(
  currentId: string,
  all: readonly T[],
): T[] {
  const current = all.find((p) => p.id === currentId);
  if (current && isIsolated(current.tags)) return [current];
  return all.filter((p) => p.id === currentId || !isIsolated(p.tags));
}
