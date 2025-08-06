// File: frontend/src/components/SymbolPicker.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  Chip,
  Tooltip,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  TrendingUp,
  Search,
  Analytics,
} from '@mui/icons-material';

// Popular stock symbols for autocomplete
const popularStocks = [
  { label: 'Apple Inc.', symbol: 'AAPL' },
  { label: 'Microsoft Corp.', symbol: 'MSFT' },
  { label: 'Alphabet Inc.', symbol: 'GOOGL' },
  { label: 'Amazon.com Inc.', symbol: 'AMZN' },
  { label: 'Tesla Inc.', symbol: 'TSLA' },
  { label: 'NVIDIA Corp.', symbol: 'NVDA' },
  { label: 'Meta Platforms Inc.', symbol: 'META' },
  { label: 'Netflix Inc.', symbol: 'NFLX' },
  { label: 'JPMorgan Chase & Co.', symbol: 'JPM' },
  { label: 'Bank of America Corp.', symbol: 'BAC' },
];

export default function SymbolPicker({ onSubmit, disabled }) {
  const [symbol, setSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticker = selectedStock ? selectedStock.symbol : symbol.trim().toUpperCase();
    if (ticker) {
      onSubmit(ticker);
      setSymbol('');
      setSelectedStock(null);
    }
  };

  const handleQuickSelect = (stockSymbol) => {
    onSubmit(stockSymbol);
  };

  return (
    <Paper
      elevation={10}
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(0, 255, 136, 0.3)',
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)',
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Autocomplete
            options={popularStocks}
            getOptionLabel={(option) => `${option.symbol} - ${option.label}`}
            value={selectedStock}
            onChange={(event, newValue) => {
              setSelectedStock(newValue);
              setSymbol(newValue ? newValue.symbol : '');
            }}
            inputValue={symbol}
            onInputChange={(event, newInputValue) => {
              setSymbol(newInputValue);
            }}
            freeSolo
            disabled={disabled}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Stock Ticker Symbol"
                placeholder="Enter ticker (e.g. AAPL, TSLA, GOOGL)"
                disabled={disabled}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    color: '#000000 !important', // Always black text
                    '& input': {
                      color: '#000000 !important', // Always black input text
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: 'text.secondary', // Keep label theme-aware
                    '&.Mui-focused': {
                      color: '#00ff88',
                    },
                  },
                }}
              />
            )}
          />
          
          <Tooltip title="Get AI Prediction">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={disabled || (!symbol.trim() && !selectedStock)}
              startIcon={disabled ? <Analytics /> : <TrendingUp />}
              sx={{
                minWidth: 140,
                height: 56,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#000000 !important', // Always black text
                '& .MuiButton-startIcon': {
                  color: '#000000 !important', // Always black icon
                },
              }}
            >
              {disabled ? 'Analyzing...' : 'Predict'}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Quick Select Popular Stocks */}
      <Box>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1 }}>
            Quick Select Popular Stocks:
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {popularStocks.slice(0, 6).map((stock) => (
            <Tooltip key={stock.symbol} title={stock.label}>
              <Chip
                label={stock.symbol}
                onClick={() => handleQuickSelect(stock.symbol)}
                disabled={disabled}
                sx={{
                  background: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(0, 255, 136, 0.1)' 
                      : 'rgba(0, 255, 136, 0.15)',
                  color: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? '#00ff88' 
                      : '#00cc6a',
                  border: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? '1px solid rgba(0, 255, 136, 0.3)' 
                      : '1px solid rgba(0, 204, 106, 0.4)',
                  '&:hover': {
                    background: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(0, 255, 136, 0.2)' 
                        : 'rgba(0, 255, 136, 0.25)',
                    borderColor: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(0, 255, 136, 0.5)' 
                        : 'rgba(0, 204, 106, 0.6)',
                    color: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? '#00ff88' 
                        : '#00a855',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}