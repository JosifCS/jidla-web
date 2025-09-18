"use client";

import { prolongFavorite } from "@/actions/prolong-favorite";
import { useEffect } from "react";

export function Actions() {
  useEffect(() => {
    prolongFavorite();
  }, []);

  return null;
}
