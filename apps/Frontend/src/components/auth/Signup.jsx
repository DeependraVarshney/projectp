import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/admin/useNotification';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Link as MuiLink,
  Avatar,
  Grid
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import authService from '../../services/authService';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  
  // Determine user role from URL
  const role = location.pathname.split('/')[2]; // Gets 'student' or 'recruiter'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        user_role: role === 'recruiter' ? 'company' : role
      };
      
      const response = await authService.register(userData);
      showSuccess('Registration successful');
      
      // Auto login after registration
      await login({
        email: formData.email,
        password: formData.password,
        user_role: userData.user_role
      });
      
      // Navigation will be handled by the auth hook based on user role
    } catch (error) {
      showError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up as {role === 'recruiter' ? 'Recruiter' : 'Student'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <MuiLink 
                component={Link} 
                to={`/auth/${role}/login`}
                variant="body2"
              >
                Already have an account? Login
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;