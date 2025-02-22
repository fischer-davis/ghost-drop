export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes < 1) return "0 Bytes";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = Math.floor(Math.log10(bytes) / 3); // Every 1000^1, 1000^2, etc.

  let size = (bytes / Math.pow(1000, index)).toFixed(2);
  return `${size} ${units[index]}`;
}
