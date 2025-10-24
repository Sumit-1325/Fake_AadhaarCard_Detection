// App.js
import React, { useState } from 'react';
import { Shield, Loader as LoaderIcon } from 'lucide-react';
import Header from './components/Header/Header';
import ResultDisplay from './components/Results/ResultDisplay';
import UploadZone from './components/Uploads/UploadZone';
import Button from './components/common/Button';
import Loader from './components/common/Loader';
import ErrorMessage from './components/common/ErrorMessage';
import api from './services/api'; // ⭐ API IMPORT
import { revokeImagePreview } from './utils/helpers';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (file, previewUrl) => {
    setImage(file);
    setPreview(previewUrl);
    setResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.predictImage(image);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze image');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (preview) revokeImagePreview(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const getEnv = (craKey, viteKey) => {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey] !== undefined) {
      return import.meta.env[viteKey];
    }
    if (typeof process !== 'undefined' && process.env && process.env[craKey] !== undefined) {
      return process.env[craKey];
    }
    return undefined;
  };

  const API_URL = getEnv('REACT_APP_API_URL', 'VITE_API_URL') || 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[150%] h-[150%] bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-[150%] h-[150%] bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full px-4 mx-auto relative z-10 flex flex-col items-center justify-center min-h-screen mb-2">
  <Header />

  {/* Main Content Grid - centered */}
<div className="grid grid-rows-2 gap-8 w-full max-w-5xl "> 
<div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col gap-y-4">
  <h2 className="text-2xl font-semibold flex items-center text-white">
    <Shield className="w-6 h-6 text-purple-400" />
    Upload Aadhaar Card
  </h2>

      {!preview ? (
        <UploadZone 
          onFileSelect={handleFileSelect}
          error={error}
          setError={setError}
        />
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain bg-black/20"
            />
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-white">
              {image.name}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={analyzeImage}
              disabled={loading}
              variant="primary"
              icon={loading ? LoaderIcon : Shield}
              className="flex-1"
            >
              {loading ? 'Analyzing...' : 'Verify Authenticity'}
            </Button>
            <Button
              onClick={reset}
              variant="secondary"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </div>

    {/* Results Section */}
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col">
  <h2 className="text-2xl font-semibold mb-4 text-white">Verification Results</h2>

      {!result && !loading && (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-center">
          <Shield className="w-20 h-20 mb-4 opacity-30" />
          <p>Upload and analyze an Aadhaar card to see results</p>
        </div>
      )}

      {loading && <Loader message="Analyzing document..." />}

      {result && <ResultDisplay result={result} />}
    </div>
  </div>

  {/* Footer */}
  <div className="mt-8 text-center text-gray-400 text-sm">
    <p>🔒 Secure document verification powered by Machine Learning</p>
  </div>
</div>
    </div>
  );
}

export default App;
