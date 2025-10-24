import React from 'react';
import { getScoreColor, getResultColor } from '../../utils/helpers';

const ScoreGauge = ({ score, threshold }) => {
  const prediction = score >= threshold ? 'REAL' : 'FAKE';
  
  return (
    <div className="bg-white/5 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-300">Authenticity Score</span>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getResultColor(prediction, score, threshold)} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-gray-400 flex justify-between">
        <span>0%</span>
        <span>Threshold: {threshold}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ScoreGauge;