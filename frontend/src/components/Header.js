import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Configurateur', path: '/configurateur' },
    { name: 'Avis clients', path: '/#avis' },
    { name: 'Contact', path: '/#contact' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <AcUnitIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          Airton Climatisation
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={RouterLink} 
            to={item.path}
            sx={{ 
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              fontWeight: isActive(item.path) ? 'bold' : 'normal'
            }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexGrow: 1
            }}>
              <AcUnitIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  color: 'text.primary',
                  textDecoration: 'none',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Airton Climatisation
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    component={RouterLink}
                    to={item.path}
                    sx={{ 
                      mx: 1,
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(item.path) ? 'bold' : 'normal'
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/configurateur"
                  sx={{ ml: 2 }}
                >
                  Configurez maintenant
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Header;
