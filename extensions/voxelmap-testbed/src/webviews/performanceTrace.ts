import * as fs from 'node:fs';
import * as path from 'node:path';

export function resolvePerformanceTracePath(
  runRoot: string,
): string | undefined {
  const tracePath = path.join(runRoot, 'test', 'Performance_Trace.png');
  return fs.existsSync(tracePath) ? tracePath : undefined;
}
