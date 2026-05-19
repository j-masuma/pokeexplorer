import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search Pokémon...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 3000);

  useEffect(() => {
    // console.log(`[SearchBar] debounced search term: "${debouncedSearchTerm}"`);
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className='px-3 py-2 outline-none border-2 border-gray-300 rounded-lg w-full max-w-md transition-colors duration-200 focus:border-orange-100 '
    />
    
  );
};