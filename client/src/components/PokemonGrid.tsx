import React from 'react';
import { PokemonListItem } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { usePokemon } from '../context/PokemonContext';

interface PokemonGridProps {
  pokemons: PokemonListItem[];
  onPokemonClick: (id: number) => void;
  favorites?: number[];
  onToggleFavorite?: (id: number) => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemons,
  onPokemonClick,
  favorites,
  onToggleFavorite,
}) => {
    const { favorites: contextFavorites, toggleFavorite } = usePokemon();
    const activeFavorites = favorites ?? contextFavorites;
    const activeToggleFavorite = onToggleFavorite ?? toggleFavorite;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        padding: '20px',
      }}
    >
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={activeFavorites.includes(pokemon.id)}
          onToggleFavorite={() => activeToggleFavorite(pokemon.id)}
          onClick={() => onPokemonClick(pokemon.id)}
        />
      ))}
    </div>
  );
};