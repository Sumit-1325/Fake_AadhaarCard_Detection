import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import ScoreGauge from './ScoreGauge';
import { getResultColor, getScoreColor } from '../../utils/helpers';

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Prediction Badge */}
      <div className={`bg-gradient-to-r ${getResultColor(result.prediction, result.authenticity_score, result.threshold)} p-6 rounded-xl text-center shadow-lg`}>
        <div className="flex items-center justify-center mb-2">
          {result.prediction === 'REAL' ? (
            <CheckCircle className="w-12 h-12 animate-bounce" />
          ) : (
            <XCircle className="w-12 h-12 animate-bounce" />
          )}
        </div>
        <h3 className="text-3xl font-bold mb-1">{result.prediction}</h3>
        <p className="text-sm opacity-90">
          {result.prediction === 'REAL' 
            ? 'Document appears authentic' 
            : 'Potential forgery detected'}
        </p>
      </div>

      {/* Score Gauge */}
      <ScoreGauge 
        score={result.authenticity_score} 
        threshold={result.threshold}
      />

      {/* Uncertainty Warning */}
      {result.uncertain && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-400">Manual Review Recommended</p>
            <p className="text-sm text-gray-300 mt-1">
              The score is near the threshold. Additional verification may be needed.
            </p>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-white/5 rounded-xl p-5 space-y-3">
        <h4 className="font-semibold text-lg mb-3 text-white">Analysis Details</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Status:</span>
            <span className="ml-2 font-semibold text-white">{result.prediction}</span>
          </div>
          <div>
            <span className="text-gray-400">Confidence:</span>
            <span className="ml-2 font-semibold text-white">
              {result.uncertain ? 'Low' : result.authenticity_score > 75 ? 'High' : 'Medium'}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-400">Decision Threshold:</span>
            <span className="ml-2 font-semibold text-white">{result.threshold}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;