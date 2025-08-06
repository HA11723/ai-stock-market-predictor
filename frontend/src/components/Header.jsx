import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Box,
  Container,
  Tooltip,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  TrendingUp,
  Analytics,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
                color: '#000',
              }}
            >
              <TrendingUp sx={{ fontSize: 28 }} />
              <Analytics sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #ff6b6b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                  mb: 0.5,
                }}
              >
                AI Stock Predictor
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  fontWeight: 400,
                }}
              >
                Advanced stock price prediction powered by AI
              </Typography>
            </Box>
          </Box>

          {/* Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00ff88',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 136, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#00ff88',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isDarkMode ? (
                      <DarkMode sx={{ color: '#00ff88' }} />
                    ) : (
                      <LightMode sx={{ color: '#ffa726' }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      {isDarkMode ? 'Dark' : 'Light'}
                    </Typography>
                  </Box>
                }
                labelPlacement="start"
                sx={{ ml: 0 }}
              />
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;