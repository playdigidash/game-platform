/**
 * Ensures a URL has a protocol (https:// if none provided)
 * @param url The URL to check
 * @returns URL with protocol
 */
export const ensureProtocol = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}; 