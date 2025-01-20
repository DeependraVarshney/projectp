import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigate = (role) => {
    navigate(`/auth/${role}/login`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/tnp.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '1 1 500px' }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Shape Your Future at NIT Kurukshetra
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: 4,
                opacity: 0.9
              }}
            >
              Connecting talent with opportunity through excellence in education
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              flex: '0 1 300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {['student', 'recruiter', 'admin'].map((role) => (
              <Button
                key={role}
                onClick={() => handleNavigate(role)}
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  backgroundColor: role === 'admin' ? '#2c3e50' : '#3498db',
                  '&:hover': {
                    backgroundColor: role === 'admin' ? '#34495e' : '#2980b9',
                  }
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Login
              </Button>
            ))}
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
