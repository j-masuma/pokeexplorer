import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList, searchPokemon } from '../services/api';
import { PokemonListItem } from '../types/pokemon';
import { SearchBar } from '../components/SearchBar';
import { GenerationFilter } from '../components/GenerationFilter';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PokemonGrid } from '../components/PokemonGrid';

export const HomePage: React.FC = () => {
    const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedGeneration, setSelectedGeneration] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    const loadPokemons = async () => {
        setLoading(true);
        try {
        const data = await getPokemonList(currentPage, 20, selectedGeneration);
        setPokemons(data.pokemons);
        setTotalPages(data.totalPages);
        } catch (error) {
        console.error('Error loading pokemons:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
        loadPokemons();
        return;
        }
        setLoading(true);
        try {
        const results = await searchPokemon(searchQuery, selectedGeneration);
        setPokemons(results);
        setTotalPages(1);
        } catch (error) {
        console.error('Error searching:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleGenerationChange = (generation: number) => {
        setSelectedGeneration(generation);
        setCurrentPage(1);
        setSearchQuery('');
    };

    const handlePokemonClick = (id: number) => {
        navigate(`/pokemon/${id}`);
    };

     useEffect(() => {
        loadPokemons();
    }, [currentPage, selectedGeneration]);

    useEffect(() => {
        if (searchQuery) {
        handleSearch();
        } else {
        loadPokemons();
        }
    }, [searchQuery, selectedGeneration]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchBar onSearch={setSearchQuery} />
            <GenerationFilter
            selectedGeneration={selectedGeneration}
            onGenerationChange={handleGenerationChange}
            />
        </div>

        {loading ? (
            <LoadingSpinner />
        ) : pokemons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
            No Pokémon found
            </div>
        ) : (
            <>
            <PokemonGrid
                pokemons={pokemons}
                onPokemonClick={handlePokemonClick}
            />

            {!searchQuery && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-2 bg-[#F08030] text-white rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Prev
                </button>
                <span className="px-5 py-2 font-bold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2 bg-[#F08030] text-white rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Next
                </button>
                </div>
            )}
            </>
        )}
        </div>
    );
    };