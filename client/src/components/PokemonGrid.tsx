import React from 'react';
import { PokemonListItem } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { usePokemon } from '../context/PokemonContext';

interface PokemonGridProps {
  pokemons: PokemonListItem[];
  onPokemonClick: (id: number) => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemons,
  onPokemonClick,
}) => {
    const { favorites, toggleFavorite } = usePokemon();

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
          isFavorite={favorites.includes(pokemon.id)}
          onToggleFavorite={() => toggleFavorite(pokemon.id)}
          onClick={() => onPokemonClick(pokemon.id)}
        />
      ))}
    </div>
  );
};