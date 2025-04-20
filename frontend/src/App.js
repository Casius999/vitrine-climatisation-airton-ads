import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';

// Pages publiques
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import QuoteGeneratorPage from './pages/QuoteGeneratorPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import QuoteManagementPage from './pages/QuoteManagementPage';

// Pages administratives
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/BackOffice/Dashboard';
import QuoteListPage from './pages/BackOffice/QuoteListPage';
import SupplierOrdersPage from './pages/BackOffice/SupplierOrdersPage';
import ConfigurationPage from './pages/BackOffice/ConfigurationPage';
import UserManagementPage from './pages/BackOffice/UserManagementPage';

// Contextes
import { QuoteProvider } from './contexts/QuoteContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QuoteProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/quote" element={<QuoteGeneratorPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/cancel" element={<PaymentCancelPage />} />
              
              {/* Routes de gestion commerciale */}
              <Route path="/quote-management" element={<QuoteManagementPage />} />
              <Route path="/quote-management/:quoteId" element={<QuoteManagementPage />} />
              
              {/* Routes administratives */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="quotes" element={<QuoteListPage />} />
                <Route path="supplier-orders" element={<SupplierOrdersPage />} />
                <Route path="configuration" element={<ConfigurationPage />} />
                <Route path="users" element={<UserManagementPage />} />
              </Route>
            </Routes>
          </Box>
        </Router>
      </QuoteProvider>
    </ThemeProvider>
  );
}

export default App;