"use server";

import { getCookieFavorites } from "@/server/get-cookies-favorites";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function toggleFavorite(restaurantKey: string) {
  const c = await cookies();
  const favorites = await getCookieFavorites();
  const newFavorites = JSON.stringify(
    favorites.includes(restaurantKey)
      ? favorites.filter((x) => x != restaurantKey)
      : [...favorites, restaurantKey]
  );

  c.set("favorite", newFavorites, {
    maxAge: 60 * 60 * 24 * 14, // je tu nějaké omezení na 14 dní, nejde nastavit více
  });
  revalidatePath("/");
}
