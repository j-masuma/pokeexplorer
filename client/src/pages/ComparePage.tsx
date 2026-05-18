import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TypeBadge } from '../components/TypeBadge';

export const ComparePage: React.FC = () => {
  const [pokemons, setPokemons] = useState<(Pokemon | null)[]>([null, null]);
  const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

 

    const loadCompareList = async () => {
        setLoading(true);
        try {
        const compareIds = JSON.parse(localStorage.getItem('compare_list') || '[]');
        const loadedPokemons = await Promise.all(
            compareIds.map(async (id: number) => {
            try {
                return await getPokemonDetails(id.toString());
            } catch {
                return null;
            }
            })
        );
        while (loadedPokemons.length < 2) loadedPokemons.push(null);
        setPokemons(loadedPokemons);
        } catch (error) {
        console.error('Error loading compare list:', error);
        } finally {
        setLoading(false);
        }
    };

  const clearComparison = () => {
    localStorage.setItem('compare_list', JSON.stringify([]));
    setPokemons([null, null]);
  };

  const getStatValue = (pokemon: Pokemon | null, statName: string): number => {
    if (!pokemon) return 0;
    const stat = pokemon.stats.find(s => s.stat.name === statName);
    return stat?.base_stat || 0;
  };

  const getTotalStats = (pokemon: Pokemon | null): number => {
    if (!pokemon) return 0;
    return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  };

  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  const statLabels = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];

   useEffect(() => {
    loadCompareList();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Compare Pokémon</h1>
        <button
          onClick={clearComparison}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Clear Comparison
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {[0, 1].map((index) => (
          <div key={index} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px' }}>
            {pokemons[index] ? (
              <>
                <img
                  src={pokemons[index]!.sprites.front_default}
                  alt={pokemons[index]!.name}
                  style={{ width: '150px', margin: '0 auto', display: 'block' }}
                />
                <h2 style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                  #{String(pokemons[index]!.id).padStart(3, '0')} {pokemons[index]!.name}
                </h2>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                  {pokemons[index]!.types.map((t) => (
                    <TypeBadge key={t.type.name} type={t.type.name} />
                  ))}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p><strong>Height:</strong> {pokemons[index]!.height / 10} m</p>
                  <p><strong>Weight:</strong> {pokemons[index]!.weight / 10} kg</p>
                  <p><strong>Total Stats:</strong> {getTotalStats(pokemons[index])}</p>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                No Pokémon selected
              </div>
            )}
          </div>
        ))}
      </div>

      {pokemons[0] && pokemons[1] && (
        <div style={{ marginTop: '40px' }}>
          <h2>Stat Comparison</h2>
          {statNames.map((statName, idx) => {
            const val1 = getStatValue(pokemons[0], statName);
            const val2 = getStatValue(pokemons[1], statName);
            const maxVal = Math.max(val1, val2, 255);
            
            return (
              <div key={statName} style={{ marginBottom: '20px' }}>
                <h3>{statLabels[idx]}</h3>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(val1 / maxVal) * 100}%`,
                          height: '40px',
                          backgroundColor: val1 >= val2 ? '#4CAF50' : '#FFC107',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '10px',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {val1}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(val2 / maxVal) * 100}%`,
                          height: '40px',
                          backgroundColor: val2 >= val1 ? '#4CAF50' : '#FFC107',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '10px',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {val2}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};