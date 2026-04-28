/**
 * Calculate the current streak for a habit based on completion history.
 *
 * Rules:
 * - Completions are YYYY-MM-DD date strings
 * - Remove duplicates before calculating
 * - Sort by date before logic
 * - If today is not completed, current streak is 0
 * - If today is completed, count consecutive calendar days backwards from today
 *
 * @param completions - Array of completion dates in YYYY-MM-DD format
 * @param today - Optional today's date in YYYY-MM-DD format (defaults to current date)
 * @returns The current streak count
 *
 * @example
 * calculateCurrentStreak([]) // => 0
 * calculateCurrentStreak(["2024-01-15"]) // => 0 (if not today)
 * calculateCurrentStreak(["2024-01-15"], "2024-01-15") // => 1
 * calculateCurrentStreak(["2024-01-15", "2024-01-14"], "2024-01-15") // => 2
 * calculateCurrentStreak(["2024-01-15", "2024-01-13"], "2024-01-15") // => 1 (gap breaks streak)
 */
export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  // Determine today's date
  if (!today) {
    const todayDate = new Date();
    const offset = todayDate.getTimezoneOffset();
    todayDate.setMinutes(todayDate.getMinutes() - offset);
    today = todayDate.toISOString().split("T")[0];
  }

  // Empty completions = no streak
  if (!completions || completions.length === 0) {
    return 0;
  }

  // Remove duplicates and sort by date (descending, most recent first)
  const uniqueCompletions = Array.from(new Set(completions)).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  // If today is not completed, streak is 0
  if (uniqueCompletions[0] !== today) {
    return 0;
  }

  // Count consecutive days backwards from today
  let streak = 0;
  let expectedDate = new Date(today);

  for (const dateStr of uniqueCompletions) {
    const expectedDateStr = expectedDate.toISOString().split("T")[0];

    if (dateStr === expectedDateStr) {
      streak++;
      // Move expected date back one day
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Gap in streak
      break;
    }
  }

  return streak;
}
