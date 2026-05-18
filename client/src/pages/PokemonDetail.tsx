import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { TypeBadge } from '../components/TypeBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usePokemon } from '../context/PokemonContext';

export const PokemonDetail: React.FC = () => {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = usePokemon();
  const navigate = useNavigate();

  useEffect(() => {
    if (nameOrId) {
      loadPokemon();
    }
  }, [nameOrId]);

  const loadPokemon = async () => {
    setLoading(true);
    try {
      const data = await getPokemonDetails(nameOrId!);
      setPokemon(data);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    const compareList = JSON.parse(localStorage.getItem('compare_list') || '[]');
    if (!compareList.includes(pokemon?.id) && compareList.length < 2) {
      compareList.push(pokemon?.id);
      localStorage.setItem('compare_list', JSON.stringify(compareList));
      alert(`${pokemon?.name} added to comparison!`);
    } else if (compareList.includes(pokemon?.id)) {
      alert('This Pokemon is already in comparison!');
    } else {
      alert('You can only compare up to 2 Pokemon!');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!pokemon) return <div>Pokemon not found</div>;

  const maxStat = 255;
  const artwork = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#F08030',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Left Column - Images and Basic Info */}
        <div>
          <img
            src={artwork}
            alt={pokemon.name}
            style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'block' }}
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>#{String(pokemon.id).padStart(3, '0')}</div>
            <h1 style={{ textTransform: 'capitalize', margin: '10px 0' }}>{pokemon.name}</h1>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button
                onClick={() => toggleFavorite(pokemon.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isFavorite(pokemon.id) ? '#ff0000' : '#F08030',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {isFavorite(pokemon.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
              <button
                onClick={handleCompare}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                🔄 Compare
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Stats and Details */}
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h2>Base Stats</h2>
            {pokemon.stats.map((stat) => {
              const percentage = (stat.base_stat / maxStat) * 100;
              return (
                <div key={stat.stat.name} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                      {stat.stat.name.replace('special', 'Sp. ')}
                    </span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <div style={{ backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '30px',
                        backgroundColor: percentage > 70 ? '#4CAF50' : percentage > 40 ? '#FFC107' : '#F44336',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <h3>Height</h3>
              <p>{pokemon.height / 10} m</p>
            </div>
            <div>
              <h3>Weight</h3>
              <p>{pokemon.weight / 10} kg</p>
            </div>
          </div>

          <div>
            <h3>Abilities</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability.ability.name}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: ability.is_hidden ? '#FFC107' : '#4CAF50',
                    color: 'white',
                    borderRadius: '8px',
                    textTransform: 'capitalize',
                  }}
                >
                  {ability.ability.name.replace('-', ' ')}
                  {ability.is_hidden && ' (Hidden)'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};