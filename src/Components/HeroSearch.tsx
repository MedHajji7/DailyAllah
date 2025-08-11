import SearchBar from "./SearchBar";
import AyahCard from "./AyahCard";
import AyahActions from "./AyahActions";
import FavoritesList from "./FavoritesList";
import { useAyah } from "../hooks/useAyah";
import { useFavorites } from "../hooks/useFavorites";

export default function HeroSearch() {
  const { ayah, setAyah, lang, setLang, loading, refreshAyah, changeLang } = useAyah();
  const { favs, toggleFav } = useFavorites();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <SearchBar lang={lang} setAyah={setAyah} />
      <AyahCard
        ayah={ayah}
        lang={lang}
        setLang={setLang}
        loading={loading}
        refreshAyah={refreshAyah}
        changeLang={changeLang}
      />
      <AyahActions ayah={ayah} toggleFav={toggleFav} isFav={favs.some(f => f.key === ayah.key)} />
      <FavoritesList favs={favs} setAyah={setAyah} />
    </div>
  );
}
