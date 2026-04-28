/**
 * Convert a habit name to a URL-friendly slug.
 *
 * @param name - The habit name to slugify
 * @returns A stable slug (lowercase, hyphens, alphanumeric only)
 *
 * @example
 * getHabitSlug("Drink Water") // => "drink-water"
 * getHabitSlug("Read Books") // => "read-books"
 * getHabitSlug("  Morning Yoga  ") // => "morning-yoga"
 * getHabitSlug("C++ Programming!") // => "c-programming"
 */
export function getHabitSlug(name: string): string {
  return (
    name
      // Convert to lowercase
      .toLowerCase()
      // Trim leading and trailing spaces
      .trim()
      // Replace one or more spaces with a single hyphen
      .replace(/\s+/g, "-")
      // Remove non-alphanumeric characters except hyphens
      .replace(/[^a-z0-9-]/g, "")
      // Remove consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}
