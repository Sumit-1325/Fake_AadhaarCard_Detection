import React from 'react';
import { Loader as LoaderIcon } from 'lucide-react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoaderIcon className="w-16 h-16 animate-spin text-purple-400 mb-4" />
      <p className="text-lg text-white">{message}</p>
      <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
    </div>
  );
};

export default Loader;