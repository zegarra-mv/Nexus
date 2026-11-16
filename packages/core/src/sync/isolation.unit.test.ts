import { describe, it, expect } from 'vitest';
import { isIsolated, visibleProjects } from './isolation.js';

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
