export type User = {
  id: string;
  email: string;
  password?: string;
  name: string;
};

// Keys for local storage
const USERS_KEY = "local_users";
const SESSION_KEY = "current_session";

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

export const getCurrentUser = (): User | null => {
  if (!isBrowser) return null;
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  const users = getLocalUsers();
  const user = users.find((u) => u.id === sessionId);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
};

export const setCurrentUser = (userId: string) => {
  if (!isBrowser) return;
  localStorage.setItem(SESSION_KEY, userId);
};

export const clearCurrentUser = () => {
  if (!isBrowser) return;
  localStorage.removeItem(SESSION_KEY);
};
