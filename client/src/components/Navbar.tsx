import React from 'react';
import { IoGameController } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';


export const Navbar: React.FC = () => {
    const { favoritesCount, compareCount } = usePokemon();

    return (
        <nav
        className=' bg-orange-400 px-3 py-3 flex justify-between  items-center shadow-md'
        >
        <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className='flex items-center text-white' style={{ fontSize: '24px' }}>
            <IoGameController size={30}/> PokéExplorer
            </h1>
        </Link>

        <div className='flex gap-3' >
            <Link
            to="/favorites"
            className='text-white flex items-center gap-1 font-semibold'
            >
            ⭐ Favorites ({favoritesCount})
            </Link>
            <Link
            to="/compare"
            className='text-white flex items-center gap-1 font-semibold'
            >
            🔄 Compare ({compareCount}/2)
            </Link>
        </div>
        </nav>
    );
    };