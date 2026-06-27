/** Skip macOS AppleDouble sidecars on external volumes (T7). */
export function isAppleDoubleEntry(name: string): boolean {
  return name.startsWith('._');
}
