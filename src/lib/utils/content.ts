export function getSummary(content: any, maxLength = 120): string {
  if (!Array.isArray(content)) return "";

  const text = content
    .flatMap((block) => block?.children ?? [])
    .filter((c) => c?.type === "text" && typeof c.text === "string")
    .map((c) => c.text.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";

  if (text.length > maxLength) {
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
  }

  return text;
}