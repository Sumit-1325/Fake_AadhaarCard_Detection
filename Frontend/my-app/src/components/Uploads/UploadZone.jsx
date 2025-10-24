import React, { useRef } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { validateFile, createImagePreview } from '../../utils/helpers';
import ErrorMessage from '../common/ErrorMessage';

const UploadZone = ({ onFileSelect, error, setError }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    const preview = createImagePreview(file);
    onFileSelect(file, preview);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="h-60 display flex flex-col items-center justify-center border-2 border-dashed border-purple-400/50 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-white/5 transition-all duration-300"
      >
        <FileImage className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-bounce" />
        <p className="text-lg mb-2 text-white">Drop your Aadhaar card here</p>
        <p className="text-sm text-gray-400">or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
      
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default UploadZone;