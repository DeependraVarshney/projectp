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
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { showError, showSuccess } = useNotification();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Determine user role from URL
  const role = location.pathname.split('/')[2]; // Gets 'student', 'recruiter', or 'admin'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: formData.email,
        password: formData.password,
        role: role
      });
    } catch (error) {
      showError(error.message || 'Login failed');
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
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
              'Login'
            )}
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <MuiLink 
              component={Link} 
              to={`/auth/${role}/forgot-password`}
              variant="body2"
            >
              Forgot password?
            </MuiLink>
            {role !== 'admin' && (
              <MuiLink 
                component={Link} 
                to={`/auth/${role}/initiate`}
                variant="body2"
              >
                Don't have an account? Sign up
              </MuiLink>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;