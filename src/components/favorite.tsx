"use client";

import { HeartIcon } from "lucide-react";
import { Toggle } from "./ui/toggle";
import { cn } from "@/lib/utils";

export function Favorite({
  restaurantKey,
  defaultPressed,
  onToggle,
}: {
  restaurantKey: string;
  defaultPressed: boolean;
  onToggle: (restaurantKey: string) => void;
}) {
  return (
    <Toggle
      defaultPressed={defaultPressed}
      value={restaurantKey}
      onClick={() => onToggle(restaurantKey)}
    >
      <HeartIcon
        className={cn(
          "text-orange-600",
          defaultPressed ? "fill-orange-600" : ""
        )}
      />
    </Toggle>
  );
}
