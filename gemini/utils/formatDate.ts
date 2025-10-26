// Returns a short, written absolute date for a given input string.
// - falsy or 'TBD' -> 'TBD'
// - parseable date -> 'Oct 25, 2025' (uses user's locale)
// - otherwise -> returns the raw trimmed input so the user sees what the AI provided

export default function formatDueDate(input?: string | null): string {
  if (!input) return 'TBD';
  const trimmed = input.trim();
  if (trimmed.toUpperCase() === 'TBD') return 'TBD';

  const parsed = Date.parse(trimmed);
  if (isNaN(parsed)) {
    return trimmed;
  }

  const date = new Date(parsed);
  const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return fmt.format(date);
}
