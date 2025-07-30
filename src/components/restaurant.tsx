import { redis } from "@/app/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "./ui/skeleton";
import { CircleXIcon, SoupIcon, UtensilsIcon } from "lucide-react";

type RestaruantMenu = {
  error?: string;
  menudnes?: {
    hlavni: {
      cena: string;
      nazev: string;
    }[];
    polevky: { cena: string; nazev: string }[];
    dnesni_datum: string;
  };
};

export async function Restaurant({ restaurantKey }: { restaurantKey: string }) {
  try {
    const menu = await redis.json.get<RestaruantMenu>(restaurantKey);

    if (menu == null)
      return (
        <ErrorCard
          name={restaurantKey}
          title="Neplatný klíč"
          description="Neplatný klíč"
        />
      );

    if (menu.error && menu.error.length)
      return (
        <ErrorCard
          name={restaurantKey}
          title="Neplatná data z API"
          description={menu.error}
        />
      );

    if (typeof menu.menudnes !== "object")
      return (
        <ErrorCard
          name={restaurantKey}
          title="Neplatná data v menudnes"
          description="Neplatná data v menudnes"
        />
      );

    if (menu.menudnes.dnesni_datum != new Date().toISOString().split("T").at(0))
      return (
        <ErrorCard
          name={restaurantKey}
          title="Data pro jiný den"
          description={menu.menudnes.dnesni_datum}
        />
      );

    return <MenuCard name={restaurantKey} menu={menu.menudnes} />;
  } catch (e: unknown) {
    return (
      <ErrorCard
        name={restaurantKey}
        title="Chyba dotazu na API"
        description={(e as Error).message}
      />
    );
  }
}

function ErrorCard({
  title,
  description,
  name,
}: {
  title: string;
  description: string;
  name: string;
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <h4 className="flex gap-2 font-semibold text-orange-600">
          <CircleXIcon /> {title}
        </h4>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}

function MenuCard({
  name,
  menu,
}: {
  name: string;
  menu: NonNullable<RestaruantMenu["menudnes"]>;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="flex gap-2 font-semibold text-orange-600 mb-2">
              <SoupIcon /> Polévky
            </h4>
            <div className="space-y-2">
              {menu.polevky.map((x, i) => (
                <div key={i} className="flex justify-between items-start">
                  <p className="font-medium text-gray-900">{x.nazev}</p>
                  <Badge variant="outline" className="ml-2 font-semibold">
                    {x.cena}
                  </Badge>
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
              {menu.hlavni.map((x, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{x.nazev}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 font-semibold">
                    {x.cena}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export async function RestaurantSkeleton({
  restaurantKey,
}: {
  restaurantKey: string;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl">{restaurantKey}</CardTitle>
      </CardHeader>

      <CardContent>
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
