export function readingTImeKO(text: string): number {
  const charsPerMinute = 400; // 한글 기준
  const charCount = text.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(charCount / charsPerMinute));
}
