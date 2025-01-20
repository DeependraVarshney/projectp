import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  styled,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0",
  width: "100%"
});

const NavButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
}));

const LogoSection = styled(Box)({
  display: "flex",
  alignItems: "center"
});

const MenuSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up('md')]: {
    marginLeft: 'auto'
  }
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = ['About', 'Recruiters', 'Team', 'Contact'];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          button 
          key={item} 
          component="a" 
          href={`#${item.toLowerCase()}`}
          onClick={handleDrawerToggle}
        >
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'rgba(61, 75, 145, 0.95)' }}>
      <Container maxWidth="lg">
        <StyledToolbar>
          <LogoSection>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                component="img"
                src="/nitkkr1.png"
                alt="NIT KKR Logo"
                sx={{ 
                  height: { xs: 40, md: 50 }, 
                  mr: 2 
                }}
              />
            </motion.div>
            <Typography 
              variant="h6" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Training & Placement Cell
            </Typography>
          </LogoSection>

          <MenuSection>
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
              <>
                {menuItems.map((item) => (
                  <NavButton 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                  >
                    {item}
                  </NavButton>
                ))}
              </>
            )}
          </MenuSection>
        </StyledToolbar>
      </Container>

      {isMobile && (
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better mobile performance
          }}
        >
          {drawer}
        </Drawer>
      )}
    </AppBar>
  );
};

export default Navbar;
