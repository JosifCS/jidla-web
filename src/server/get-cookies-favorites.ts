import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

export async function getCookieFavorites(
  c?: ReadonlyRequestCookies
): Promise<string[]> {
  const cc = c ?? (await cookies());
  const obj = cc.get("favorite")?.value;

  if (obj == null) return [];

  try {
    const d = JSON.parse(obj);

    if (Array.isArray(d)) return d;
  } catch (e: unknown) {
    console.log(e);
  }

  return [];
}
