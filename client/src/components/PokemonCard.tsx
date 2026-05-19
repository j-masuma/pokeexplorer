import React from 'react';
import { PokemonListItem } from '../types/pokemon';
import { TypeBadge } from './TypeBadge';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const spriteUrl = pokemon.data.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: 'white',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: isFavorite ? '#ff0000' : '#cccccc',
        }}
      >
        {isFavorite ? <IoIosHeart className='text-red-600' /> : <IoIosHeartEmpty />}

      </button>

      <div className='text-center'>
        <img
          src={spriteUrl}
          alt={pokemon.name}
          style={{
            width: '96px',
            height: '96px',
            imageRendering: 'pixelated',
          }}
        />
        <div className='text-sm text-gray-600 mt-2 ' >
          #{String(pokemon.id).padStart(3, '0')}
        </div>
        <div className='text-lg font-bold mt-1 capitalize'>
          {pokemon.name}
        </div>
        <div className='flex gap-2 justify-center mt-3 flex-wrap'>
          {pokemon.types.map((typeName) => (
            <TypeBadge key={typeName} type={typeName} />
          ))}
        </div>
      </div>
    </div>
  );
};