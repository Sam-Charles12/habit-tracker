export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type Session = {
  userId: string;
  email: string;
};

// Keys for local storage — matches persistence contract
const USERS_KEY = "habit-tracker-users";
const SESSION_KEY = "habit-tracker-session";

// Helper to check if we are in the browser
const isBrowser = typeof window !== "undefined";

export const getLocalUsers = (): User[] => {
  if (!isBrowser) return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setLocalUsers = (users: User[]) => {
  if (!isBrowser) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentSession = (): Session | null => {
  if (!isBrowser) return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored || stored === "null") return null;
  return JSON.parse(stored);
};

export const getCurrentUser = (): User | null => {
  if (!isBrowser) return null;
  const session = getCurrentSession();
  if (!session) return null;
  const users = getLocalUsers();
  const user = users.find((u) => u.id === session.userId);
  return user || null;
};

export const setCurrentUser = (userId: string, email: string) => {
  if (!isBrowser) return;
  const session: Session = { userId, email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearCurrentUser = () => {
  if (!isBrowser) return;
  localStorage.removeItem(SESSION_KEY);
};
