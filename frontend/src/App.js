// File: frontend/src/App.js

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Fade,
  Divider,
} from "@mui/material";

import { getPrediction } from "./services/api";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import SymbolPicker from "./components/SymbolPicker";
import PredictionChart from "./components/PredictionChart";
import PredictionResults from "./components/PredictionResults";
import PriceBoard from "./components/PriceBoard";

// Helper function to get next trading day - simplified approach
const getNextTradingDay = () => {
  const today = new Date();
  const futureDate = new Date(today);

  // Add 1 day for next trading day prediction
  futureDate.setDate(today.getDate() + 1);

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

function AppContent() {
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
    <Box sx={{ minHeight: "100vh", pb: 4 }}>
      <Header />

      <Container maxWidth="xl">
        {/* Prediction Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 1,
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Stock Prediction
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter a stock symbol to get AI-powered price predictions
            </Typography>
          </Box>
          <SymbolPicker onSubmit={handlePredict} disabled={loading} />
        </Box>

        {/* Loading State */}
        {loading && (
          <Fade in={loading}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress
                size={60}
                sx={{
                  color: "#00ff88",
                  mb: 2,
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{ color: "#00ff88", fontWeight: 600 }}
              >
                Analyzing {ticker} with AI...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Processing historical data and generating predictions
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Error State */}
        {error && (
          <Fade in={Boolean(error)}>
            <Alert
              severity="error"
              sx={{
                mb: 4,
                background: "rgba(255, 107, 107, 0.1)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                "& .MuiAlert-icon": {
                  color: "#ff6b6b",
                },
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Chart Section */}
        {history.length > 0 && predPoint && !loading && (
          <Fade in={true} timeout={600}>
            <Box sx={{ mb: 6 }}>
              {console.log("Chart - predPoint.date:", predPoint.date)}
              {console.log(
                "Chart - formatted predPoint.date:",
                formatDate(predPoint.date)
              )}
              <PredictionChart data={history} predictionPoint={predPoint} />

              {/* Prediction Results Cards */}
              <PredictionResults
                history={history}
                predPoint={predPoint}
                ticker={ticker}
              />
            </Box>
          </Fade>
        )}

        {/* Divider */}
        <Divider
          sx={{
            my: 6,
            borderColor: "rgba(255, 255, 255, 0.1)",
            "&::before, &::after": {
              borderColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        />

        {/* Live Market Prices Section */}
        <Box sx={{ mb: 4 }}>
          <PriceBoard
            tickers={["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA"]}
          />
        </Box>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}
