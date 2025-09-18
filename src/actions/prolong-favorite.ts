"use server";

import { getCookieFavorites } from "@/server/get-cookies-favorites";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function prolongFavorite() {
  const c = await cookies();
  const favorites = await getCookieFavorites();

  c.set("favorite", JSON.stringify(favorites), {
    maxAge: 60 * 60 * 24 * 14, // je tu nějaké omezení na 14 dní, nejde nastavit více
  });
  revalidatePath("/");
}
