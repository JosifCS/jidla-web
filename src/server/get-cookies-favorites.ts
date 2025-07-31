import { cookies } from "next/headers";

export async function getCookieFavorites(): Promise<string[]> {
  const c = await cookies();
  const obj = c.get("favorite")?.value;

  if (obj == null) return [];

  try {
    const d = JSON.parse(obj);

    if (Array.isArray(d)) return d;
  } catch (e: unknown) {}

  return [];
}
