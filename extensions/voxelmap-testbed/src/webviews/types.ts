export interface MetricsJson {
  angles: number[];
  dice: number[];
  psnr: number[];
  mse?: number[];
  ssim?: number[];
  shifts_mm: {
    lr: number[];
    si: number[];
    ap: number[];
    '3d': number[];
  };
  gt_shifts_mm?: {
    lr: number[];
    si: number[];
    ap: number[];
  };
}

export interface MetricsSummary {
  meanDice: number;
  meanPsnr: number;
  mean3dErrorMm: number;
  angleCount: number;
}

export interface LeaderboardRow {
  rank: number;
  name: string;
  meanDice: number;
  mean3dErrorMm?: number;
  isRun?: boolean;
}

export interface LossPoint {
  epoch: number;
  trainLoss: number;
  valLoss: number;
}
