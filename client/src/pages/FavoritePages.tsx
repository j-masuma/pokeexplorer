import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonGrid } from '../components/PokemonGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getPokemonDetails } from '../services/api';
import { PokemonListItem } from '../types/pokemon';
import { usePokemon } from '../context/PokemonContext';

export const FavoritesPage: React.FC = () => {
  const [favoritePokemons, setFavoritePokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = usePokemon();
  const navigate = useNavigate();

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const pokemonDetails = await Promise.all(
        favorites.map(async (id) => {
          const data = await getPokemonDetails(id.toString());
          return {
            _id: id.toString(),
            id: data.id,
            name: data.name,
            data: data,
            generation: 1,
            types: data.types.map(t => t.type.name)
          } as PokemonListItem;
        })
      );
      setFavoritePokemons(pokemonDetails);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [favorites]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-5">
        <h1 className="text-3xl font-bold">
            ⭐ Favorite Pokémon</h1>
      {favoritePokemons.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          No favorite Pokémon yet. Go to the home page and add some!
        </div>
      ) : (
        <PokemonGrid
          pokemons={favoritePokemons}
          onPokemonClick={(id) => navigate(`/pokemon/${id}`)}
        />
      )}
    </div>
  );
};