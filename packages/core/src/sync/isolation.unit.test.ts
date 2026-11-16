import { describe, it, expect } from 'vitest';
import {
  isIsolated,
  visibleProjects,
  isolatedProjectIds,
  crossesIsolation,
  filterForViewer,
} from './isolation.js';

const projects = [
  { id: 'a', name: 'Alpha', tags: ['negocio'] },
  { id: 'b', name: 'Beta', tags: ['personal'] },
  { id: 'n', name: 'Nodia', tags: ['nodia', 'separado'] },
  { id: 'u', name: 'Untagged', tags: undefined },
];

const names = (ps: Array<{ name: string }>) => ps.map((p) => p.name);

describe('isIsolated', () => {
  it('recognises the isolation tags, ignoring case and whitespace', () => {
    expect(isIsolated(['separado'])).toBe(true);
    expect(isIsolated([' Separate '])).toBe(true);
    expect(isIsolated(['ISOLATED'])).toBe(true);
  });

  it('is false for other or missing tags', () => {
    expect(isIsolated(['negocio', 'separation-of-concerns'])).toBe(false);
    expect(isIsolated([])).toBe(false);
    expect(isIsolated(undefined)).toBe(false);
  });
});

describe('visibleProjects', () => {
  it('hides an isolated project from every other project', () => {
    expect(names(visibleProjects('a', projects))).toEqual(['Alpha', 'Beta', 'Untagged']);
  });

  it('shows an isolated project only itself', () => {
    expect(names(visibleProjects('n', projects))).toEqual(['Nodia']);
  });

  it('leaves the portfolio unchanged when nothing is isolated', () => {
    const open = projects.filter((p) => p.id !== 'n');
    expect(visibleProjects('b', open)).toEqual(open);
  });
});

describe('crossesIsolation', () => {
  const iso = new Set(['n']);
  it('flags a record linking an isolated project with another', () => {
    expect(crossesIsolation(['a', 'n'], iso)).toBe(true);
  });
  it('allows records within one project or between open projects', () => {
    expect(crossesIsolation(['n'], iso)).toBe(false);
    expect(crossesIsolation(['n', 'n'], iso)).toBe(false);
    expect(crossesIsolation(['a', 'b'], iso)).toBe(false);
  });
});

describe('filterForViewer', () => {
  const iso = isolatedProjectIds(projects);
  const rows = [
    { id: 1, projectId: 'a' },
    { id: 2, projectId: 'n' },
    { id: 3, projectId: undefined },
    { id: 4, projectId: 'b' },
  ];
  const ids = (rs: Array<{ id: number }>) => rs.map((r) => r.id);

  it('hides isolated records from an open project', () => {
    expect(ids(filterForViewer(rows, 'a', iso))).toEqual([1, 3, 4]);
  });
  it('hides isolated records when the viewer is in no project', () => {
    expect(ids(filterForViewer(rows, null, iso))).toEqual([1, 3, 4]);
  });
  it('shows an isolated viewer only its own and global records', () => {
    expect(ids(filterForViewer(rows, 'n', iso))).toEqual([2, 3]);
  });
});
