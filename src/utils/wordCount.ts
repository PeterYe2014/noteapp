const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;

export function calculateWordCount(content: string): number {
  const trimmed = content.trim();
  if (!trimmed) return 0;

  // Count CJK characters individually
  const cjkMatches = trimmed.match(CJK_REGEX);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  // Remove CJK characters, then count remaining space-separated words
  const nonCjk = trimmed.replace(CJK_REGEX, ' ').trim();
  const nonCjkCount = nonCjk ? nonCjk.split(/\s+/).filter(Boolean).length : 0;

  return cjkCount + nonCjkCount;
}
