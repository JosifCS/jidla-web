"use server";

import { getCookieFavorites } from "@/server/get-cookies-favorites";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function toggleFavorite(restaurantKey: string) {
  const c = await cookies();
  const favorites = await getCookieFavorites();
  c.set(
    "favorite",
    JSON.stringify(
      favorites.includes(restaurantKey)
        ? favorites.filter((x) => x != restaurantKey)
        : [...favorites, restaurantKey]
    )
  );
  revalidatePath("/");
}
