export function toUnixTime(timestamp: string): number {
  return Math.floor((new Date(timestamp).getTime() / 1000));
}