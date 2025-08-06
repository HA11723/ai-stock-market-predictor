import { createTheme } from "@mui/material/styles";

// Custom color palette
const colors = {
  primary: {
    main: "#00ff88",
    light: "#4dffaa",
    dark: "#00cc6a",
    contrastText: "#000000",
  },
  secondary: {
    main: "#00ccff",
    light: "#4dd9ff",
    dark: "#00a3cc",
    contrastText: "#000000",
  },
  error: {
    main: "#ff6b6b",
    light: "#ff8e8e",
    dark: "#cc5555",
  },
  warning: {
    main: "#ffa726",
    light: "#ffb74d",
    dark: "#f57c00",
  },
  success: {
    main: "#00ff88",
    light: "#4dffaa",
    dark: "#00cc6a",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
};

// Dark theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    ...colors,
    background: {
      default: "#000000",
      paper: "rgba(15, 15, 15, 0.9)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    divider: "rgba(255, 255, 255, 0.1)",
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontSize: "3.5rem",
      fontWeight: 900,
      letterSpacing: "-0.02em",
      background:
        "linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #ff6b6b 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0 2px 4px rgba(0, 0, 0, 0.1)",
    "0 4px 8px rgba(0, 0, 0, 0.15)",
    "0 8px 16px rgba(0, 0, 0, 0.2)",
    "0 12px 24px rgba(0, 0, 0, 0.25)",
    "0 16px 32px rgba(0, 0, 0, 0.3)",
    "0 20px 40px rgba(0, 0, 0, 0.35)",
    "0 24px 48px rgba(0, 0, 0, 0.4)",
    "0 28px 56px rgba(0, 0, 0, 0.45)",
    "0 32px 64px rgba(0, 0, 0, 0.5)",
    "0 15px 35px rgba(0, 0, 0, 0.3)",
    "0 25px 50px rgba(0, 0, 0, 0.4)",
    "0 20px 40px rgba(0, 255, 136, 0.1)",
    "0 8px 25px rgba(0, 255, 136, 0.4)",
    "0 0 30px rgba(0, 255, 136, 0.3)",
    "0 0 20px rgba(0, 255, 136, 0.3)",
    "0 0 30px rgba(0, 255, 136, 0.1)",
    "0 4px 15px rgba(0, 255, 136, 0.3)",
    "0 10px 30px rgba(0, 0, 0, 0.3)",
    "0 20px 40px rgba(0, 0, 0, 0.4)",
    "0 25px 50px rgba(0, 0, 0, 0.5)",
    "0 30px 60px rgba(0, 0, 0, 0.6)",
    "0 35px 70px rgba(0, 0, 0, 0.7)",
    "0 40px 80px rgba(0, 0, 0, 0.8)",
    "0 45px 90px rgba(0, 0, 0, 0.9)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "black",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 10%, rgba(0, 204, 255, 0.1) 0%, transparent 50%)
            `,
            animation: "float 20s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: -1,
          },
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "33%": { transform: "translateY(-20px) rotate(1deg)" },
            "66%": { transform: "translateY(10px) rotate(-1deg)" },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.4s ease",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #00ff88, #00ccff)",
          },
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
            transition: "left 0.5s",
          },
          "&:hover::before": {
            left: "100%",
          },
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #00ff88 0%, #00ccff 100%)",
          color: "#000000",
          boxShadow: "0 4px 15px rgba(0, 255, 136, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #00ccff 0%, #00ff88 100%)",
            boxShadow: "0 8px 25px rgba(0, 255, 136, 0.4)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 12,
            transition: "all 0.3s ease",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 255, 136, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00ff88",
              boxShadow: "0 0 0 3px rgba(0, 255, 136, 0.1)",
            },
            "&.Mui-focused": {
              background: "rgba(255, 255, 255, 0.15)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.7)",
            "&.Mui-focused": {
              color: "#00ff88",
            },
          },
          "& .MuiOutlinedInput-input": {
            color: "#ffffff",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          },
        },
      },
    },
  },
});

// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    ...colors,
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  typography: darkTheme.typography,
  shape: darkTheme.shape,
  components: {
    ...darkTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          transition: "all 0.4s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
});
