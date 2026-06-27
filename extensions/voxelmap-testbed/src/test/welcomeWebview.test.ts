// Task ID: 1.2.7 — Welcome webview
import { describe, expect, it } from 'vitest';
import {
  buildWelcomeData,
  modeBadgeFor,
  modeMessageFor,
  welcomeStepsHtml,
} from '../webviews/welcomeWebview';

describe('1.2.7 welcomeWebview', () => {
  it('mock mode shows mock badge and message', () => {
    expect(modeBadgeFor('mock')).toBe('mock');
    expect(modeMessageFor('mock')).toContain('mock mode');
  });

  it('demo mode shows demo badge and message', () => {
    expect(modeBadgeFor('demo')).toBe('demo');
    expect(modeMessageFor('demo')).toContain('demo mode');
  });

  it('buildWelcomeData includes quick-start commands', () => {
    const data = buildWelcomeData('mock', 'spare-demo-v1');
    expect(data.modeBadge).toBe('mock');
    expect(data.packHint).toContain('spare-demo-v1');
    const commands = data.steps.map((s) => s.command);
    expect(commands).toContain('vmtb.gold.verify');
    expect(commands).toContain('vmtb.experiment.run');
    expect(commands).toContain('vmtb.results.open');
  });

  it('welcomeStepsHtml renders command buttons', () => {
    const html = welcomeStepsHtml(buildWelcomeData('demo').steps);
    expect(html).toContain('data-cmd="vmtb.gold.verify"');
    expect(html).toContain('Verify Gold');
  });
});
