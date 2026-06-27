export interface GoldManifest {
  schema_version: number;
  pack_id: string;
  created: string;
  preprocessing: {
    pipeline_version: string;
    learn_gui_commit: string;
    grid_size: number;
    spare_password_applied: boolean;
  };
  datasets: Array<{ id: string; source: string; patients_independent: boolean }>;
  scans: GoldScan[];
  profiles: Record<string, GoldProfile>;
  checksums: Record<string, string>;
}

export interface GoldScan {
  scan_id: string;
  path: string;
  split_roles: string[];
  tags: string[];
}

export interface GoldProfile {
  description: string;
  train?: string[];
  test?: string[];
}

export interface ExperimentEntry {
  fileName: string;
  name: string;
  profile: string;
}

export interface RunEntry {
  runId: string;
  status: string;
  meanDice?: number;
}

export interface RunArtifact {
  name: string;
  relativePath: string;
  kind: 'file' | 'folder';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  metricLabel: string;
  isRun?: boolean;
}

export interface BaselinesFile {
  profile: string;
  pack_id: string;
  rows: Array<{
    rank: number;
    name: string;
    mean_dice: number;
    mean_3d_error_mm: number;
  }>;
}
