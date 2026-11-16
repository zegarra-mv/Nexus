export { syncClaudeMd, removeNexusSection } from './claude-md-sync.js';
export type { SyncInput, SyncResult, PortfolioEntry } from './claude-md-sync.js';
export { selectRelevantProjects } from './relevance.js';
export {
  isIsolated,
  visibleProjects,
  isolatedProjectIds,
  crossesIsolation,
  filterForViewer,
  ISOLATION_TAGS,
} from './isolation.js';
export type { ProjectCandidate } from './relevance.js';
