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

/** IDs of every isolated project in the list. */
export function isolatedProjectIds(
  projects: ReadonlyArray<{ id: string; tags?: string[] | undefined }>,
): Set<string> {
  return new Set(projects.filter((p) => isIsolated(p.tags)).map((p) => p.id));
}

/**
 * True when a record links an isolated project with any other project.
 * Such a record must not exist: an isolated project only relates to itself.
 */
export function crossesIsolation(
  projectIds: readonly string[],
  isolatedIds: ReadonlySet<string>,
): boolean {
  const distinct = new Set(projectIds);
  if (distinct.size < 2) return false;
  return [...distinct].some((id) => isolatedIds.has(id));
}

/**
 * Filter records that carry a projectId for an agent working in `viewerId`
 * (null: the agent is in no registered project).
 *  - viewer isolated: only the viewer's own records (and global ones, which
 *    carry no projectId)
 *  - otherwise: every record except those of isolated projects
 */
export function filterForViewer<T extends { projectId?: string | null | undefined }>(
  records: readonly T[],
  viewerId: string | null,
  isolatedIds: ReadonlySet<string>,
): T[] {
  const viewerIsolated = viewerId !== null && isolatedIds.has(viewerId);
  return records.filter((r) => {
    if (!r.projectId) return true;
    if (viewerIsolated) return r.projectId === viewerId;
    return !isolatedIds.has(r.projectId);
  });
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
