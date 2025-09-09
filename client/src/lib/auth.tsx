import { baseUrl } from './request';

export type User = {
  email: string;
  password: string;
};
export const login = async (user: User) => {
  const response = await fetch(`${baseUrl}/login`, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({ email: user.email, password: btoa(user.password) }),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};

const localStorageKey = 'user_token';
export const logout = () => {
  localStorage.removeItem(localStorageKey);
};

export const setUser = (user: { token: string }) => {
  localStorage.setItem(localStorageKey, user.token);
};

export function getUserToken(): string | null {
  return localStorage.getItem(localStorageKey);
}
