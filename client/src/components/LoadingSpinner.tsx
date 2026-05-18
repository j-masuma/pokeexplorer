import React from 'react';
import { ImSpinner6 } from 'react-icons/im';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-10">
      <ImSpinner6 className="animate-spin text-[#F08030] text-3xl" />
    </div>
  );
};