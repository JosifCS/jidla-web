import { prolongFavorite } from "@/actions/prolong-favorite";
import { Restaurant, RestaurantSkeleton } from "@/components/restaurant";
import { getCookieFavorites } from "@/server/get-cookies-favorites";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { Suspense } from "react";

const redis = Redis.fromEnv();

export default async function Page() {
  const restaurants = await redis.keys("*");
  const favorites = await getCookieFavorites();

  const favoritesSet = new Set(favorites);

  const sortedRestaurants = restaurants.sort((a, b) => {
    const aIsFavorite = favoritesSet.has(a);
    const bIsFavorite = favoritesSet.has(b);

    if (aIsFavorite && !bIsFavorite) return -1;
    else if (!aIsFavorite && bIsFavorite) return 1;
    else return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Jídla AI</h1>
          <p className="text-gray-600 text-lg">
            Dnešní jídelníčky -{" "}
            {new Date().toLocaleDateString("cs-CZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <Suspense
              key={restaurant}
              fallback={<RestaurantSkeleton restaurantKey={restaurant} />}
            >
              <Restaurant
                restaurantKey={restaurant}
                favorite={favorites.includes(restaurant)}
              />
            </Suspense>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p>Vytvořeno s láskou k jídlu</p>
        </div>
      </div>
    </div>
  );
}
