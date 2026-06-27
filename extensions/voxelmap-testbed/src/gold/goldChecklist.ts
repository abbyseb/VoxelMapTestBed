import type { GoldProfile, GoldScan } from '../data/types';

/** Collect unique tags across all scans (sorted). */
export function collectAllTags(scans: GoldScan[]): string[] {
  const tags = new Set<string>();
  for (const scan of scans) {
    for (const tag of scan.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort();
}

/** Keep scans that include every active tag (AND filter). Empty filter = all scans. */
export function filterScansByTags(
  scans: GoldScan[],
  activeTags: readonly string[],
): GoldScan[] {
  if (activeTags.length === 0) {
    return scans;
  }
  return scans.filter((scan) =>
    activeTags.every((tag) => scan.tags.includes(tag)),
  );
}

/** Scan ids referenced by a manifest profile (train + test). */
export function scanIdsFromProfile(profile: GoldProfile): string[] {
  const ids = new Set<string>();
  for (const id of profile.train ?? []) {
    ids.add(id);
  }
  for (const id of profile.test ?? []) {
    ids.add(id);
  }
  return [...ids].sort();
}

export class GoldChecklist {
  private readonly selected = new Set<string>();
  private tagFilter: string[] = [];

  constructor(initialSelected: readonly string[] = []) {
    for (const id of initialSelected) {
      this.selected.add(id);
    }
  }

  getActiveTags(): readonly string[] {
    return this.tagFilter;
  }

  setTagFilter(tags: readonly string[]): void {
    this.tagFilter = [...tags].sort();
  }

  clearTagFilter(): void {
    this.tagFilter = [];
  }

  filterScans(scans: readonly GoldScan[]): GoldScan[] {
    return filterScansByTags([...scans], this.tagFilter);
  }

  isSelected(scanId: string): boolean {
    return this.selected.has(scanId);
  }

  setSelected(scanId: string, checked: boolean): void {
    if (checked) {
      this.selected.add(scanId);
    } else {
      this.selected.delete(scanId);
    }
  }

  toggle(scanId: string): boolean {
    if (this.selected.has(scanId)) {
      this.selected.delete(scanId);
      return false;
    }
    this.selected.add(scanId);
    return true;
  }

  applyProfile(profile: GoldProfile): void {
    this.selected.clear();
    for (const id of scanIdsFromProfile(profile)) {
      this.selected.add(id);
    }
  }

  getSelected(): string[] {
    return [...this.selected].sort();
  }

  selectedCount(): number {
    return this.selected.size;
  }
}
