export function wrap(string: string, ...wrappers: string[]): string {
  return [...wrappers, string, ...wrappers.reverse()].join('');
}

export function isURL(string: string): boolean {
  try {
    const url = new URL(string);
    const safeProtocols = ['http:', 'https:', 'ftp:', 'mailto:'];
    return safeProtocols.includes(url.protocol);
  } catch {
    return false;
  }
}

export function isPotentiallyEncoded(uri: string): boolean {
  return uri !== decodeURIComponent(uri || '');
}
