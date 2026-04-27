export type Habit = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
};

export type HabitLog = {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
};

const HABITS_KEY = "local_habits";
const HABIT_LOGS_KEY = "local_habit_logs";

const isBrowser = typeof window !== "undefined";

// --- Habits ---

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
  return habits.filter((h) => h.userId === userId).sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

export const addHabit = (userId: string, title: string): Habit => {
  const habits = getLocalHabits();
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    userId,
    title,
    createdAt: new Date().toISOString(),
  };
  setLocalHabits([...habits, newHabit]);
  return newHabit;
};

export const editHabit = (habitId: string, newTitle: string) => {
  const habits = getLocalHabits();
  const index = habits.findIndex((h) => h.id === habitId);
  if (index !== -1) {
    habits[index].title = newTitle;
    setLocalHabits(habits);
  }
};

export const deleteHabit = (habitId: string) => {
  const habits = getLocalHabits();
  setLocalHabits(habits.filter((h) => h.id !== habitId));
  
  // Clean up logs
  const logs = getLocalHabitLogs();
  setLocalHabitLogs(logs.filter((l) => l.habitId !== habitId));
};

// --- Logs & Streaks ---

export const getLocalHabitLogs = (): HabitLog[] => {
  if (!isBrowser) return [];
  const stored = localStorage.getItem(HABIT_LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setLocalHabitLogs = (logs: HabitLog[]) => {
  if (!isBrowser) return;
  localStorage.setItem(HABIT_LOGS_KEY, JSON.stringify(logs));
};

export const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  today.setMinutes(today.getMinutes() - offset);
  return today.toISOString().split("T")[0];
};

export const toggleHabitCompletion = (habitId: string, date: string) => {
  const logs = getLocalHabitLogs();
  const existingLogIndex = logs.findIndex(
    (l) => l.habitId === habitId && l.date === date
  );

  if (existingLogIndex !== -1) {
    logs[existingLogIndex].completed = !logs[existingLogIndex].completed;
  } else {
    logs.push({ habitId, date, completed: true });
  }

  setLocalHabitLogs(logs);
};

export const getHabitLogsForDate = (date: string): HabitLog[] => {
  const logs = getLocalHabitLogs();
  return logs.filter((l) => l.date === date);
};

export const isHabitCompletedToday = (habitId: string, date: string): boolean => {
  const logs = getLocalHabitLogs();
  const log = logs.find((l) => l.habitId === habitId && l.date === date);
  return log?.completed || false;
};

export const calculateStreak = (habitId: string): number => {
  const logs = getLocalHabitLogs()
    .filter((l) => l.habitId === habitId && l.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (logs.length === 0) return 0;

  let streak = 0;
  const todayStr = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const offset = yesterday.getTimezoneOffset();
  yesterday.setMinutes(yesterday.getMinutes() - offset);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // If the most recent completion is neither today nor yesterday, streak is broken
  if (logs[0].date !== todayStr && logs[0].date !== yesterdayStr) {
    return 0;
  }

  // Iterate backwards and count consecutive days
  let expectedDateStr = logs[0].date;
  
  for (const log of logs) {
    if (log.date === expectedDateStr) {
      streak++;
      // Set expected to the day before
      const expectedDate = new Date(expectedDateStr);
      expectedDate.setDate(expectedDate.getDate() - 1);
      // Correct for timezone offset issues
      expectedDate.setMinutes(expectedDate.getMinutes() - expectedDate.getTimezoneOffset());
      expectedDateStr = expectedDate.toISOString().split("T")[0];
    } else {
      break; // Gap in streak
    }
  }

  return streak;
};
