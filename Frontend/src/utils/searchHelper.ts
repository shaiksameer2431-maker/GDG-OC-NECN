/**
 * Order-independent, multi-token search matcher.
 * Matches if ALL words/tokens from the query exist anywhere in the searchable fields,
 * regardless of the order they appear in (e.g., "Shaik sameer" matches "Sameer Shaik").
 */
export function matchesSearchQuery(
  query: string,
  ...fields: (string | null | undefined)[]
): boolean {
  if (!query || !query.trim()) return true;

  const cleanQuery = query.toLowerCase().trim();
  const tokens = cleanQuery.split(/[\s,.-]+/).filter(Boolean);
  if (tokens.length === 0) return true;

  // Combine and normalize all target text fields
  const combined = fields
    .filter(Boolean)
    .map(f => String(f).toLowerCase().replace(/[\s,.-]+/g, ' '))
    .join(' ');

  // Direct substring check
  if (combined.includes(cleanQuery)) return true;

  // Every token in the query must be present in the combined text
  return tokens.every(token => combined.includes(token));
}
