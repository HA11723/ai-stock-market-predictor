// File: frontend/src/components/SymbolPicker.jsx
import React, { useState } from 'react';

export default function SymbolPicker({ onSubmit, disabled }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (symbol.trim()) onSubmit(symbol.trim().toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="symbol-picker-form">
      <input
        type="text"
        value={symbol}
        onChange={e => setSymbol(e.target.value)}
        placeholder="Enter ticker symbol (e.g. AAPL, TSLA, GOOGL)"
        className="symbol-input"
        disabled={disabled}
      />
      <button
        type="submit"
        className="predict-button"
        disabled={disabled}
      >
        {disabled ? 'Predicting...' : 'Predict'}
      </button>
    </form>
  );
}