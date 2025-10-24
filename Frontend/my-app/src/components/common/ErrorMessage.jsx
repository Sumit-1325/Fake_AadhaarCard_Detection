import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <span className="flex-1 text-white">{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-red-400 hover:text-red-300 text-xl leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;