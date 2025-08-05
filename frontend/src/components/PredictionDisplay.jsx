// File: frontend/src/components/PredictionDisplay.jsx
import React from 'react';

export default function PredictionDisplay({ result }) {
  if (!result) return null;
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{result.ticker} Prediction</h2>
      <p className="mt-2 text-2xl">${result.prediction.toFixed(2)}</p>
    </div>
  );
}