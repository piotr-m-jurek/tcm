import { assert } from './assert';
import { getUserToken } from './auth';

export const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchData<Type extends unknown[]>(
  url: string,
  rawParams?: Record<string, string | undefined>
): Promise<Type> {
  const user = getUserToken();
  assert(user, 'fetchData: User not found');
  const params = Object.entries(rawParams ?? {}).filter(
    ([, value]) => value !== undefined
  ) as [string, string][];

  const urlSearchParams = new URLSearchParams(params).toString();

  const res = await fetch(`${baseUrl}/api/${url}?${urlSearchParams}`, {
    credentials: 'include',
    method: 'GET',
    headers: { Authorization: `Bearer ${user}` },
  });
  const json = await res.json();
  return json;
}

export async function patchData<Type extends unknown[]>(
  url: string,
  body: FormData
): Promise<Type> {
  const user = getUserToken();
  assert(user, 'patchData: User not found');

  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PATCH',
    body,
    credentials: 'include',
    headers: { Authorization: `Bearer ${user}` },
  });
  return res.json();
}

export async function postData<Type extends unknown[]>(
  url: string,
  body: FormData
): Promise<Type> {
  const user = getUserToken();
  assert(user, 'postData: User not found');

  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'POST',
    body,
    credentials: 'include',
    headers: { Authorization: `Bearer ${user}` },
  });
  return res.json();
}
