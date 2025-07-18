export const isAdmin = () => {
  return import.meta.env.VITE_ENV === "development";
};


export const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchData<Type extends unknown[]>(
  url: string,
  rawParams?: Record<string, string | undefined>
): Promise<Type> {
  const params = Object.entries(rawParams ?? {}).filter(
    ([, value]) => value !== undefined
  ) as [string, string][];

  const urlSearchParams = new URLSearchParams(params).toString();

  const res = await fetch(`${baseUrl}/${url}?${urlSearchParams}`);
  return res.json();
}

export async function postData<Type extends unknown[]>(
  url: string,
  body: FormData
): Promise<Type> {
  const res = await fetch(`${baseUrl}/${url}`, { method: "POST", body, });
  return res.json();
}
