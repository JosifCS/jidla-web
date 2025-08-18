import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "./ui/skeleton";
import { CircleXIcon, SoupIcon, UtensilsIcon } from "lucide-react";
import { Redis } from "@upstash/redis";
import { MenuCard, RestaruantMenu } from "./menu-card";
import { Favorite } from "./favorite";
import { toggleFavorite } from "@/actions/toggle-favorite";

const redis = Redis.fromEnv();

export async function Restaurant({
  restaurantKey,
  favorite,
}: {
  restaurantKey: string;
  favorite: boolean;
}) {
  try {
    const menu = await redis.json.get<RestaruantMenu>(restaurantKey);

    if (menu == null)
      return (
        <ErrorCard
          name={restaurantKey}
          title="Neplatný klíč"
          description="Neplatný klíč"
          favorite={favorite}
          checked={undefined}
        />
      );

    if (menu.error && menu.error.length)
      return (
        <ErrorCard
          name={restaurantKey}
          title="Neplatná data z API"
          description={menu.error}
          favorite={favorite}
          checked={menu.checked}
        />
      );

    if (typeof menu.menudnes !== "object")
      return (
        <ErrorCard
          name={restaurantKey}
          title="Neplatná data v menudnes"
          description="Neplatná data v menudnes"
          favorite={favorite}
          checked={menu.checked}
        />
      );

    if (menu.menudnes.dnesni_datum != new Date().toISOString().split("T").at(0))
      return (
        <ErrorCard
          name={restaurantKey}
          title="Data pro jiný den"
          description={menu.menudnes.dnesni_datum}
          favorite={favorite}
          checked={menu.checked}
        />
      );

    return (
      <MenuCard
        name={restaurantKey}
        menu={menu.menudnes}
        checked={menu.checked}
        favorite={favorite}
      />
    );
  } catch (e: unknown) {
    return (
      <ErrorCard
        name={restaurantKey}
        title="Chyba dotazu na API"
        description={(e as Error).message}
        favorite={favorite}
        checked={undefined}
      />
    );
  }
}

function ErrorCard({
  title,
  description,
  name,
  favorite,
  checked
}: {
  title: string;
  description: string;
  name: string;
  favorite: boolean;
  checked: string | undefined;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between">
          {name}
          <Favorite
            defaultPressed={favorite}
            restaurantKey={name}
            onToggle={toggleFavorite}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 flex-grow">
        <h4 className="flex gap-2 font-semibold text-orange-600">
          <CircleXIcon /> {title}
        </h4>
        <p>{description}</p>
      </CardContent>

      {checked && (
        <CardFooter className="text-xs justify-end text-gray-500">
          ({new Date(checked).toLocaleString("cs", {timeZone: "Europe/Prague"})})
        </CardFooter>
      )}
    </Card>
  );
}

export async function RestaurantSkeleton({
  restaurantKey,
}: {
  restaurantKey: string;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{restaurantKey}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="flex gap-2 font-semibold text-orange-600 mb-2">
              <SoupIcon /> Polévky
            </h4>
            <div className="space-y-2">
              {[0, 1].map((x) => (
                <div key={x} className="flex justify-between items-start">
                  <Skeleton className="h-[22px] w-44" />
                  <Skeleton className="h-[22px] w-12" />
                </div>
              ))}
            </div>
          </div>
          <Separator />

          <div>
            <h4 className="flex gap-2 font-semibold text-orange-600 mb-3">
              <UtensilsIcon /> Hlavní chody
            </h4>
            <div className="space-y-2">
              {[0, 1].map((x) => (
                <div key={x} className="flex justify-between items-start">
                  <Skeleton className="h-[22px] w-44" />
                  <Skeleton className="h-[22px] w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
