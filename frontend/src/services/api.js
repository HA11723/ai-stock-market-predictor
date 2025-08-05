// File: frontend/src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export async function getPrediction(ticker, window = 60) {
  const { data } = await axios.post(`${API_URL}/api/predict`, {
    ticker,
    window,
  });
  return data;
}

// ← This must be here:
export async function getQuotes(tickers) {
  const { data } = await axios.post(`${API_URL}/api/quotes`, { tickers });
  return data;
}
