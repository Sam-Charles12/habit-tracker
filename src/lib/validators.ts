/**
 * Validation result for habit names.
 */
export interface ValidationResult {
  valid: boolean;
  value: string;
  error: string | null;
}

/**
 * Validate a habit name according to the following rules:
 * - Trim the input value
 * - Reject empty values
 * - Reject values longer than 60 characters
 * - Return normalized (trimmed) value when valid
 *
 * @param name - The habit name to validate
 * @returns A validation result with status, normalized value, and error message
 *
 * @example
 * validateHabitName("  Morning Yoga  ")
 * // => { valid: true, value: "Morning Yoga", error: null }
 *
 * validateHabitName("")
 * // => { valid: false, value: "", error: "Habit name is required" }
 *
 * validateHabitName("a".repeat(61))
 * // => { valid: false, value: "a".repeat(61), error: "Habit name must be 60 characters or fewer" }
 */
export function validateHabitName(name: string): ValidationResult {
  // Trim the input
  const trimmed = name.trim();

  // Check if empty
  if (!trimmed) {
    return {
      valid: false,
      value: "",
      error: "Habit name is required",
    };
  }

  // Check if too long
  if (trimmed.length > 60) {
    return {
      valid: false,
      value: trimmed,
      error: "Habit name must be 60 characters or fewer",
    };
  }

  // Valid
  return {
    valid: true,
    value: trimmed,
    error: null,
  };
}
