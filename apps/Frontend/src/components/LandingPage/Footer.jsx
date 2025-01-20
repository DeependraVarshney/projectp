import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Link } from '@mui/material';
import { Email, Phone, LinkedIn, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a237e",
        color: "white",
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Training & Placement Office
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              National Institute of Technology
              <br />
              Kurukshetra, Haryana - 136119
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">+91-1744-233208</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">tnp@nitkkr.ac.in</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="#about" color="inherit" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link href="#recruiters" color="inherit" display="block" sx={{ mb: 1 }}>
              Past Recruiters
            </Link>
            <Link href="#team" color="inherit" display="block" sx={{ mb: 1 }}>
              Our Team
            </Link>
            <Link href="#contact" color="inherit" display="block">
              Contact Us
            </Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center' 
          }}
        >
          © {new Date().getFullYear()} Training & Placement Cell, NIT Kurukshetra
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
