import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ConfigProvider } from './contexts/ConfigContext';
import { BookingProvider } from './contexts/BookingContext';
import HomePage from './pages/HomePage';
import ConfirmationPage from './pages/ConfirmationPage';

// Thème personnalisé pour l'application
const theme = createTheme({
  palette: {
    primary: {
      main: '#0059b3', // Bleu Airton
      light: '#4785e5',
      dark: '#004080',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff9900', // Orange pour les accents
      light: '#ffb84d',
      dark: '#cc7a00',
      contrastText: '#000',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '10px 20px',
        },
        containedPrimary: {
          boxShadow: '0 4px 8px rgba(0, 89, 179, 0.2)',
        },
        containedSecondary: {
          boxShadow: '0 4px 8px rgba(255, 153, 0, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfigProvider>
        <BookingProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              {/* Ajouter d'autres routes si nécessaire */}
            </Routes>
          </Router>
        </BookingProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;