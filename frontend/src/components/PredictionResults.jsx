import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Tooltip,
  Fade,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  PriceCheck,
  Analytics,
  AccessTime,
} from '@mui/icons-material';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PredictionResults = ({ history, predPoint, ticker }) => {
  if (!history || !predPoint) return null;

  const currentPrice = history[history.length - 1];
  const priceChange = predPoint.close - currentPrice.close;
  const percentChange = (priceChange / currentPrice.close) * 100;
  const isPositive = priceChange >= 0;

  return (
    <Box sx={{ mt: 4 }}>
      {/* Section Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          AI Prediction Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Advanced LSTM analysis for {ticker}
        </Typography>
      </Box>

      {/* Prediction Cards */}
      <Grid container spacing={4}>
        {/* Current Price Card */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={600}>
            <Card
              elevation={12}
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #ff6b6b, #ff8e8e)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PriceCheck sx={{ color: '#ff6b6b', fontSize: 24 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Current Price
                    </Typography>
                  </Box>
                  
                  <Tooltip title="Today's Market Price">
                    <Chip
                      icon={<AccessTime />}
                      label={formatDate(new Date().toISOString().split("T")[0])}
                      size="small"
                      sx={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        color: '#ff6b6b',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                      }}
                    />
                  </Tooltip>
                </Box>

                {/* Price Value */}
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    fontWeight: 900,
                    color: 'text.primary',
                    mb: 2,
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  ${currentPrice.close.toFixed(2)}
                </Typography>

                {/* Badge */}
                <Chip
                  label="Latest Market Data"
                  sx={{
                    background: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* AI Prediction Card */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Card
              elevation={12}
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #00ff88, #00ccff)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Analytics sx={{ color: '#00ff88', fontSize: 24 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      AI Prediction
                    </Typography>
                  </Box>
                  
                  <Tooltip title="Next Trading Day Prediction">
                    <Chip
                      icon={<Timeline />}
                      label={formatDate(predPoint.date)}
                      size="small"
                      sx={{
                        background: 'rgba(0, 255, 136, 0.1)',
                        color: '#00ff88',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                      }}
                    />
                  </Tooltip>
                </Box>

                {/* Price Value */}
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    fontWeight: 900,
                    color: 'text.primary',
                    mb: 2,
                    textShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                  }}
                >
                  ${predPoint.close.toFixed(2)}
                </Typography>

                {/* Change Indicator & Badge */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Chip
                    label="LSTM Neural Network"
                    sx={{
                      background: 'rgba(0, 255, 136, 0.2)',
                      color: '#00ff88',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  />
                  
                  <Tooltip
                    title={`Predicted ${isPositive ? 'increase' : 'decrease'} of $${Math.abs(priceChange).toFixed(2)}`}
                  >
                    <Chip
                      icon={
                        isPositive ? (
                          <TrendingUp sx={{ fontSize: '18px !important' }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: '18px !important' }} />
                        )
                      }
                      label={`${isPositive ? '+' : ''}${priceChange.toFixed(2)} (${percentChange.toFixed(2)}%)`}
                      sx={{
                        fontWeight: 600,
                        background: isPositive 
                          ? 'rgba(0, 255, 136, 0.2)' 
                          : 'rgba(255, 107, 107, 0.2)',
                        color: isPositive ? '#00ff88' : '#ff6b6b',
                        border: `1px solid ${
                          isPositive 
                            ? 'rgba(0, 255, 136, 0.3)' 
                            : 'rgba(255, 107, 107, 0.3)'
                        }`,
                        '& .MuiChip-icon': {
                          color: isPositive ? '#00ff88' : '#ff6b6b',
                        },
                      }}
                    />
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Analysis Summary */}
      <Fade in={true} timeout={1000}>
        <Card
          elevation={8}
          sx={{
            mt: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Analysis Summary
            </Typography>
            <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Current Trend
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {isPositive ? '📈 Bullish' : '📉 Bearish'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Confidence Level
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  🎯 AI-Generated
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Data Points
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  📊 {history.length} Days
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default PredictionResults;