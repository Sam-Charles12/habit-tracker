export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[]; // unique ISO calendar dates in YYYY-MM-DD format
};

// Key for local storage — matches persistence contract
const HABITS_KEY = "habit-tracker-habits";

const isBrowser = typeof window !== "undefined";

// --- Habits CRUD ---

export const getLocalHabits = (): Habit[] => {
  if (!isBrowser) return [];
  const stored = localStorage.getItem(HABITS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setLocalHabits = (habits: Habit[]) => {
  if (!isBrowser) return;
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const getUserHabits = (userId: string): Habit[] => {
  const habits = getLocalHabits();
  return habits
    .filter((h) => h.userId === userId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
};

export const addHabit = (
  userId: string,
  name: string,
  description: string = "",
): Habit => {
  const habits = getLocalHabits();
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    userId,
    name,
    description,
    frequency: "daily",
    createdAt: new Date().toISOString(),
    completions: [],
  };
  setLocalHabits([...habits, newHabit]);
  return newHabit;
};

export const editHabit = (habitId: string, newName: string) => {
  const habits = getLocalHabits();
  const index = habits.findIndex((h) => h.id === habitId);
  if (index !== -1) {
    habits[index].name = newName;
    setLocalHabits(habits);
  }
};

export const deleteHabit = (habitId: string) => {
  const habits = getLocalHabits();
  setLocalHabits(habits.filter((h) => h.id !== habitId));
};

// --- Completions & Streaks ---

export const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  today.setMinutes(today.getMinutes() - offset);
  return today.toISOString().split("T")[0];
};

/**
 * Toggle completion status for a habit on a specific date.
 * Operates on the habit object directly (immutable).
 *
 * @param habit - The habit object to toggle
 * @param date - The date to toggle (YYYY-MM-DD format)
 * @returns A new Habit object with toggled completion (original not mutated)
 *
 * @example
 * const habit = { id: "1", name: "Yoga", completions: [] };
 * const updated = toggleHabitCompletion(habit, "2024-01-15");
 * // => { ...habit, completions: ["2024-01-15"] }
 */
export const toggleHabitCompletion = (habit: Habit, date: string): Habit => {
  if (habit.completions.includes(date)) {
    // Remove the date (unmark)
    return {
      ...habit,
      completions: habit.completions.filter((d) => d !== date),
    };
  } else {
    // Add the date (mark), ensuring uniqueness
    return {
      ...habit,
      completions: [...habit.completions, date],
    };
  }
};

/**
 * Toggle completion status for a habit in localStorage (legacy).
 * This function modifies the habit in the stored habits list.
 *
 * @param habitId - The ID of the habit to toggle
 * @param date - The date to toggle (YYYY-MM-DD format)
 *
 * @deprecated Use the single-habit toggleHabitCompletion() instead
 */
export const toggleHabitCompletionInStorage = (
  habitId: string,
  date: string,
) => {
  const habits = getLocalHabits();
  const index = habits.findIndex((h) => h.id === habitId);
  if (index === -1) return;

  const habit = habits[index];

  if (habit.completions.includes(date)) {
    // Unmark — remove the date
    habit.completions = habit.completions.filter((d) => d !== date);
  } else {
    // Mark — add the date (ensure unique)
    habit.completions = [...habit.completions, date];
  }

  setLocalHabits(habits);
};

export const isHabitCompletedToday = (
  habitId: string,
  date: string,
): boolean => {
  const habits = getLocalHabits();
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return false;
  return habit.completions.includes(date);
};

export const calculateStreak = (habitId: string): number => {
  const habits = getLocalHabits();
  const habit = habits.find((h) => h.id === habitId);
  if (!habit || habit.completions.length === 0) return 0;

  // Sort completions descending
  const sorted = [...habit.completions].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const todayStr = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const offset = yesterday.getTimezoneOffset();
  yesterday.setMinutes(yesterday.getMinutes() - offset);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // If the most recent completion is neither today nor yesterday, streak is broken
  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) {
    return 0;
  }

  // Count consecutive days backwards
  let streak = 0;
  let expectedDateStr = sorted[0];

  for (const dateStr of sorted) {
    if (dateStr === expectedDateStr) {
      streak++;
      // Set expected to the day before
      const expectedDate = new Date(expectedDateStr);
      expectedDate.setDate(expectedDate.getDate() - 1);
      expectedDate.setMinutes(
        expectedDate.getMinutes() - expectedDate.getTimezoneOffset(),
      );
      expectedDateStr = expectedDate.toISOString().split("T")[0];
    } else {
      break; // Gap in streak
    }
  }

  return streak;
};
