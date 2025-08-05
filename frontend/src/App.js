// File: frontend/src/App.js

import React, { useState, useEffect } from "react";
import "./App.css";

import { getPrediction } from "./services/api";
import SymbolPicker from "./components/SymbolPicker";
import PredictionChart from "./components/PredictionChart";
import PriceBoard from "./components/PriceBoard";

// Helper function to get next trading day - simplified approach
const getNextTradingDay = () => {
  const today = new Date();
  const futureDate = new Date(today);

  // Simply add 2 days to ensure it's always in the future
  futureDate.setDate(today.getDate() + 2);

  console.log("Today:", today.toDateString());
  console.log("Future prediction date:", futureDate.toDateString());

  return futureDate;
};

// Helper function to format date nicely
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function App() {
  const [ticker, setTicker] = useState(null);
  const [history, setHistory] = useState([]);
  const [predPoint, setPredPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (sym) => {
    setTicker(sym);
    setLoading(true);
    setError(null);
    try {
      const { history: hist, prediction } = await getPrediction(sym);

      // Get the next trading day from today
      const nextTradingDay = getNextTradingDay();
      const nextDate = nextTradingDay.toISOString().split("T")[0];

      console.log("Setting prediction date:", nextDate);
      console.log("Last historical date:", hist[hist.length - 1]?.date);

      setHistory(hist);
      setPredPoint({ date: nextDate, close: prediction });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Poll every minute when a ticker is set
  useEffect(() => {
    if (!ticker) return;
    const id = setInterval(() => handlePredict(ticker), 60_000);
    return () => clearInterval(id);
  }, [ticker]);

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">AI Stock Predictor</h1>
          <p className="app-subtitle">
            Advanced stock price prediction powered by AI
          </p>
        </header>

        {/* Prediction section */}
        <div className="prediction-section">
          <h2 className="section-title">Stock Prediction</h2>
          <SymbolPicker onSubmit={handlePredict} disabled={loading} />
        </div>

        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* Chart Section */}
        {history.length > 0 && predPoint && (
          <div className="chart-section">
            {console.log("Chart - predPoint.date:", predPoint.date)}
            {console.log(
              "Chart - formatted predPoint.date:",
              formatDate(predPoint.date)
            )}
            <PredictionChart data={history} predictionPoint={predPoint} />

            {/* Prediction Cards - Now below the chart */}
            <div className="prediction-cards">
              <div className="prediction-card current">
                <div className="card-header">
                  <span className="card-label">Current Price</span>
                  <span className="card-date">
                    {formatDate(history[history.length - 1].date)}
                  </span>
                </div>
                <div className="card-value">
                  ${history[history.length - 1].close.toFixed(2)}
                </div>
                <div className="card-footer">
                  <span className="card-badge current-badge">Last Close</span>
                </div>
              </div>

              <div className="prediction-card predicted">
                <div className="card-header">
                  <span className="card-label">AI Prediction</span>
                  <span className="card-date">
                    {formatDate(predPoint.date)}
                  </span>
                </div>
                <div className="card-value">${predPoint.close.toFixed(2)}</div>
                <div className="card-footer">
                  <span className="card-badge prediction-badge">Predicted</span>
                  <span
                    className={`change-indicator ${
                      predPoint.close > history[history.length - 1].close
                        ? "positive"
                        : "negative"
                    }`}
                  >
                    {predPoint.close > history[history.length - 1].close
                      ? "↗"
                      : "↘"}
                    {(
                      ((predPoint.close - history[history.length - 1].close) /
                        history[history.length - 1].close) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Stock Prices - Moved to bottom */}
        <div className="live-prices-section">
          <h2 className="section-title">Live Market Prices</h2>
          <PriceBoard
            tickers={["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA"]}
          />
        </div>
      </div>
    </div>
  );
}
