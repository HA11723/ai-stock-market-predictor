// File: frontend/src/components/PriceBoard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  Fade,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  AttachMoney,
} from '@mui/icons-material';
import { getQuotes } from '../services/api';

export default function PriceBoard({ tickers }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getQuotes(tickers);
      setQuotes(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Quotes error:', err);
    } finally {
      setLoading(false);
    }
  }, [tickers]);

  useEffect(() => {
    fetchQuotes();
    const id = setInterval(fetchQuotes, 30_000); // Reduced to 30 seconds with backend caching
    return () => clearInterval(id);
  }, [fetchQuotes]);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading && quotes.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: '#00ff88',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with refresh button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h2" sx={{ mb: 0.5 }}>
            Live Market Prices
          </Typography>
          {lastUpdated && (
            <Typography variant="body2" color="text.secondary">
              Last updated: {formatTime(lastUpdated)}
            </Typography>
          )}
        </Box>
        <Tooltip title="Refresh Prices">
          <IconButton
            onClick={fetchQuotes}
            disabled={loading}
            sx={{
              color: '#00ff88',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
              },
            }}
          >
            <Refresh
              sx={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': {
                    transform: 'rotate(0deg)',
                  },
                  '100%': {
                    transform: 'rotate(360deg)',
                  },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Price Cards Grid */}
      <Grid container spacing={3}>
        {quotes.map((quote, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={quote.ticker}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card
                elevation={10}
                sx={{
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  {/* Ticker Symbol */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <AttachMoney sx={{ color: '#00ff88', fontSize: 20 }} />
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {quote.ticker}
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      color: 'text.primary',
                      textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    ${quote.price.toFixed(2)}
                  </Typography>

                  {/* Change Indicator */}
                  <Tooltip
                    title={`${quote.change >= 0 ? 'Gain' : 'Loss'} of $${Math.abs(
                      quote.change
                    ).toFixed(2)}`}
                  >
                    <Chip
                      icon={
                        quote.change >= 0 ? (
                          <TrendingUp sx={{ fontSize: '18px !important' }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: '18px !important' }} />
                        )
                      }
                      label={`${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(
                        2
                      )} (${quote.percent.toFixed(2)}%)`}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        background: quote.change >= 0 
                          ? 'rgba(0, 255, 136, 0.2)' 
                          : 'rgba(255, 107, 107, 0.2)',
                        color: quote.change >= 0 ? '#00ff88' : '#ff6b6b',
                        border: `1px solid ${
                          quote.change >= 0 
                            ? 'rgba(0, 255, 136, 0.3)' 
                            : 'rgba(255, 107, 107, 0.3)'
                        }`,
                        '& .MuiChip-icon': {
                          color: quote.change >= 0 ? '#00ff88' : '#ff6b6b',
                        },
                      }}
                    />
                  </Tooltip>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
