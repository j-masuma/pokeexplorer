import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const FAVORITES_KEY = "pokemon_favorites";
const COMPARE_KEY = "compare_list";

type PokemonContextType = {
  favorites: number[];
  compareList: number[];

  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;

  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;

  favoritesCount: number;
  compareCount: number;
};

const PokemonContext = createContext<PokemonContextType | undefined>(
  undefined
);

export const PokemonProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);

  // Load localStorage data on app start
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    const storedCompare = localStorage.getItem(COMPARE_KEY);

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    if (storedCompare) {
      setCompareList(JSON.parse(storedCompare));
    }
  }, []);

  // ---------- FAVORITES ----------

  const addFavorite = (id: number) => {
    if (favorites.includes(id)) return;

    const updated = [...favorites, id];

    setFavorites(updated);

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated)
    );
  };

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((item) => item !== id);

    setFavorites(updated);

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated)
    );
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const isFavorite = (id: number) => favorites.includes(id);

  // ---------- COMPARE ----------

  const addToCompare = (id: number) => {
    if (compareList.includes(id)) return;

    if (compareList.length >= 2) return;

    const updated = [...compareList, id];

    setCompareList(updated);

    localStorage.setItem(
      COMPARE_KEY,
      JSON.stringify(updated)
    );
  };

  const removeFromCompare = (id: number) => {
    const updated = compareList.filter((item) => item !== id);

    setCompareList(updated);

    localStorage.setItem(
      COMPARE_KEY,
      JSON.stringify(updated)
    );
  };

  const clearCompare = () => {
    setCompareList([]);

    localStorage.setItem(
      COMPARE_KEY,
      JSON.stringify([])
    );
  };

  const isInCompare = (id: number) =>
    compareList.includes(id);

  return (
    <PokemonContext.Provider
      value={{
        favorites,
        compareList,

        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,

        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,

        favoritesCount: favorites.length,
        compareCount: compareList.length,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);

  if (!context) {
    throw new Error(
      "usePokemon must be used inside PokemonProvider"
    );
  }

  return context;
};