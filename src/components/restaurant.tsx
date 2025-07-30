import { redis } from "@/app/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "./ui/skeleton";

type RestaruantMenu = {
  error: string;
  menudnes: {
    hlavni: {
      cena: string;
      nazev: string;
    }[];
    polevky: { cena: string; nazev: string }[];
    dnesni_datum: string;
  };
};

export async function Restaurant({ restaurantKey }: { restaurantKey: string }) {
  const menu = await redis.json.get<RestaruantMenu>("saloonroudna-cz");

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl">{restaurantKey}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-orange-600 mb-2">🍲 Polévky</h4>
            <div className="space-y-2">
              {menu?.menudnes.polevky.map((x, i) => (
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
            <h4 className="font-semibold text-orange-600 mb-3">
              🍽️ Hlavní chody
            </h4>
            <div className="space-y-2">
              {menu?.menudnes.hlavni.map((x, i) => (
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
            <h4 className="font-semibold text-orange-600 mb-2">🍲 Polévky</h4>
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
            <h4 className="font-semibold text-orange-600 mb-3">
              🍽️ Hlavní chody
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
