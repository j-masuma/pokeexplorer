import React from 'react';

interface GenerationFilterProps {
  selectedGeneration: number;
  onGenerationChange: (generation: number) => void;
}

export const GenerationFilter: React.FC<GenerationFilterProps> = ({
  selectedGeneration,
  onGenerationChange,
}) => {
  const generations = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Gen 1' },
    { id: 2, name: 'Gen 2' },
    { id: 3, name: 'Gen 3' },
    { id: 4, name: 'Gen 4' },
    { id: 5, name: 'Gen 5' },
    { id: 6, name: 'Gen 6' },
    { id: 7, name: 'Gen 7' },
    { id: 8, name: 'Gen 8' },
    { id: 9, name: 'Gen 9' },
  ];

  return (
    <div className='flex gap-2 flex-wrap'>
      {generations.map((gen) => (
        <button
          key={gen.id}
          onClick={() => onGenerationChange(gen.id)}
          className='px-2 py-1 rounded-md text-sm font-light cursor-pointer'
          style={{
            backgroundColor: selectedGeneration === gen.id ? '#F08030' : '#f0f0f0',
            color: selectedGeneration === gen.id ? 'white' : '#333',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (selectedGeneration !== gen.id) {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedGeneration !== gen.id) {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }
          }}
        >
          {gen.name}
        </button>
      ))}
    </div>
  );
};