import { SoupIcon, UtensilsIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Favorite } from "./favorite";
import { toggleFavorite } from "@/actions/toggle-favorite";

export type RestaruantMenu = {
  error?: string;
  menudnes?: {
    hlavni: {
      cena: string;
      nazev: string;
    }[];
    polevky: { cena: string; nazev: string }[];
    /** YYYY-MM-DD */
    dnesni_datum: string;
  };
  /** ISO Date */
  checked?: string;
};

export function MenuCard({
  name,
  menu,
  favorite,
  checked,
}: {
  name: string;
  menu: NonNullable<RestaruantMenu["menudnes"]>;
  favorite: boolean;
  checked: string | undefined;
}) {
  return (
    <Card className="overflow-hidden">
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
                    {formatPrice(x.cena)}
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
                    {formatPrice(x.cena)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {checked && (
        <CardFooter className="text-xs justify-end text-gray-500">
          ({new Date(checked).toLocaleString()})
        </CardFooter>
      )}
    </Card>
  );
}

function formatPrice(price: string) {
  if (price.length == 0) return "?";

  return Number(price.replace(/\D/g, "")).toLocaleString("cs", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  });
}
