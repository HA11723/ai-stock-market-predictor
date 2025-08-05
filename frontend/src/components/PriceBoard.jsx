// File: frontend/src/components/PriceBoard.jsx
import React, { useState, useEffect } from 'react';
import { getQuotes } from '../services/api';

export default function PriceBoard({ tickers }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await getQuotes(tickers);
      setQuotes(data);
    } catch (err) {
      console.error('Quotes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    const id = setInterval(fetchQuotes, 60_000);
    return () => clearInterval(id);
  }, [tickers]);

  return (
    <div className="price-board">
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {!loading &&
        quotes.map(q => (
          <div key={q.ticker} className="price-card">
            <h3>{q.ticker}</h3>
            <p className="price">${q.price.toFixed(2)}</p>
            <p className={`change ${q.change >= 0 ? 'positive' : 'negative'}`}>
              {q.change >= 0 ? '+' : ''}
              {q.change.toFixed(2)} ({q.percent.toFixed(2)}%)
            </p>
          </div>
        ))}
    </div>
  );
}
