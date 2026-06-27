export interface WelcomeStep {
  label: string;
  command: string;
  description: string;
}

export interface WelcomeData {
  dataMode: string;
  modeBadge: string;
  modeMessage: string;
  packHint: string;
  steps: WelcomeStep[];
}

export function modeBadgeFor(dataMode: string): string {
  if (dataMode === 'demo') {
    return 'demo';
  }
  if (dataMode === 'live') {
    return 'live';
  }
  return 'mock';
}

export function modeMessageFor(dataMode: string): string {
  switch (dataMode) {
    case 'demo':
      return 'You are in demo mode — real preprocessed cases from vmtb.demoPath, fixture runs for results.';
    case 'live':
      return 'Live mode — backend + Gold path (Phase 4+).';
    default:
      return 'You are in mock mode — fixtures only, no GPU or Gold prep required.';
  }
}

export function buildWelcomeData(
  dataMode: string,
  packId = 'spare-demo-v1',
): WelcomeData {
  return {
    dataMode,
    modeBadge: modeBadgeFor(dataMode),
    modeMessage: modeMessageFor(dataMode),
    packHint: `Gold pack: ${packId}`,
    steps: [
      {
        label: 'Verify Gold',
        command: 'vmtb.gold.verify',
        description: 'Check manifest and scan folders',
      },
      {
        label: 'Pick profile',
        command: 'vmtb.gold.pickProfile',
        description: 'smoke / train_mix / custom checklist',
      },
      {
        label: 'Run experiment (mock)',
        command: 'vmtb.experiment.run',
        description: 'Simulated job → runs/exp_mock_*',
      },
      {
        label: 'Open Results',
        command: 'vmtb.results.open',
        description: 'Metrics, gantry plot, performance trace',
      },
      {
        label: 'Open Leaderboard',
        command: 'vmtb.leaderboard.open',
        description: 'Baselines + your runs',
      },
      {
        label: 'Open Train monitor',
        command: 'vmtb.train.open',
        description: 'Replay loss_demo.csv',
      },
    ],
  };
}

export function welcomeStepsHtml(steps: WelcomeStep[]): string {
  return steps
    .map(
      (s) =>
        `<li><button class="step" data-cmd="${s.command}">${s.label}</button>` +
        `<span class="sub"> — ${s.description}</span></li>`,
    )
    .join('');
}
