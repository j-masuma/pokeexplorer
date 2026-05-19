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
    const [totalCount, setTotalCount] = useState(0);
    const [selectedGeneration, setSelectedGeneration] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    const loadPokemons = async () => {
        setLoading(true);
        try {
        const data = await getPokemonList(currentPage, 20, selectedGeneration);
        setPokemons(data.pokemons);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
        } catch (error) {
        console.error('Error loading pokemons:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
        await loadPokemons();
        return;
        }
        setLoading(true);
        try {
        const results = await searchPokemon(searchQuery, selectedGeneration);
        setPokemons(results);
        setTotalPages(1);
        setTotalCount(results.length);
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
        if (searchQuery.trim()) {
        handleSearch();
        } else {
        loadPokemons();
        }
    }, [currentPage, selectedGeneration, searchQuery]);

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
            <div className='flex justify-between items-center px-5 md:px-0'>
                <div className='text-sm text-gray-600'>
                Total Pokémon: {totalCount}
                </div>
                {!searchQuery && (
                <div className='text-sm text-gray-600'>
                    Page {currentPage} of {totalPages}
                </div>
                )}
            </div>
            <PokemonGrid
                pokemons={pokemons}
                onPokemonClick={handlePokemonClick}
            />

            {!searchQuery && (
                <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-2 bg-[#F08030] text-white rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Prev
                </button>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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