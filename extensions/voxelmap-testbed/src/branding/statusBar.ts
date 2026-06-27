/** Status bar label for Phase 2 branding. */
export function formatStatusBarText(dataMode: string, packId?: string): string {
  const mode =
    dataMode === 'demo' ? 'demo' : dataMode === 'live' ? 'live' : 'mock';
  const pack = packId?.trim() || '—';
  return `TestBed · ${mode} · ${pack}`;
}
