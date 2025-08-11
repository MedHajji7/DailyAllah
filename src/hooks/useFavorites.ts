import { useState, useEffect } from "react";
import { Ayah } from "./useAyah";

export function useFavorites() {
  const [favs, setFavs] = useState<Ayah[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("fav_ayahs") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("fav_ayahs", JSON.stringify(favs));
  }, [favs]);

  function toggleFav(ayah: Ayah) {
    const exists = favs.find((f) => f.key === ayah.key);
    if (exists) setFavs(favs.filter((f) => f.key !== ayah.key));
    else setFavs([{ ...ayah }, ...favs].slice(0, 100));
  }

  return { favs, toggleFav };
}
