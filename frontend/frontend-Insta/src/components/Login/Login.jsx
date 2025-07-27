import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Divider, 
  InputAdornment,
  Link 
} from '@mui/material';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://insta-to-delete-later-1.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.email, // Using whatever user entered as username
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isLogin ? 'Login failed' : 'Registration failed'));
      }

      // Store the token in localStorage if it exists
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect to posts page
      navigate('/posts');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      bgcolor="black"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="auto"
      p={2}
    >
      <Box 
        width={{ xs: '100%', sm: 400, md: 400 }}
        maxWidth="100%"
        mx="auto"
        my={0}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4 },
            textAlign: 'center', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Box mb={4}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Dancing Script", cursive',
                fontSize: { xs: '2.5rem', sm: '3rem' },
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.2
              }}
            >
              Instagram
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
                InputLabelProps={{
                  style: { 
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                }}
                InputProps={{
                  style: { 
                    fontSize: '0.9rem',
                    backgroundColor: 'transparent',
                    color: 'white'
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px #000000 inset',
                      WebkitTextFillColor: '#ffffff',
                      caretColor: '#ffffff',
                    },
                  },
                }}
              />
            )}
            <TextField
              fullWidth
              margin="normal"
              label={isLogin ? "Phone number, username, or email" : "Email"}
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              size="small"
              required
              InputLabelProps={{
                style: { 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                },
              }}
              InputProps={{
                style: { 
                  fontSize: '0.9rem',
                  backgroundColor: 'rgb(18, 18, 18)',
                  color: 'white'
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  backgroundColor: 'transparent',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 100px #000000 inset',
                    WebkitTextFillColor: '#ffffff',
                    caretColor: '#ffffff',
                    borderRadius: '4px',
                  },
                },
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              size="small"
              required
              InputLabelProps={{
                style: { 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                },
              }}
              InputProps={{
                style: { 
                  fontSize: '0.9rem',
                backgroundColor: 'rgb(18, 18, 18)',
                  color: 'white'
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="body2"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      sx={{
                        color: 'rgb(74, 93, 249)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        px: 1,
                        '&:active': {
                          opacity: 0.7,
                        }
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1, mb: 2 }}>
                {error}
              </Typography>
            )}
            
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={isLoading}
              sx={{ 
                mt: 2, 
                mb: 2, 
                textTransform: 'none', 
                bgcolor: 'rgb(74, 93, 249)',
                '&:hover': {
                  bgcolor: 'rgb(60, 80, 235)'
                },
                py: 1,
                fontSize: '0.9rem'
              }}
            >
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
            
            <Box display="flex" alignItems="center" my={2}>
              <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                OR
              </Typography>
              <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
            </Box>
            
            <Box textAlign="center" mb={2}>
              <Link href="#" underline="none">
                <Typography variant="body2" color="#385185" sx={{ fontWeight: 500 }}>
                  Log in with Facebook
                </Typography>
              </Link>
            </Box>
            
            <Box textAlign="center">
              <Link href="#" variant="body2" color="inherit" underline="none">
                Forgot password?
              </Link>
            </Box>
          </form>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 2, mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link 
              href="#" 
              sx={{ 
                color: 'rgb(74, 93, 249)',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
