import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login/Login';
import Posts from './components/Posts/Posts';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(74, 93, 249)',
    },
    background: {
      default: 'rgb(0, 0, 0)',
      paper: 'rgb(0, 0, 0)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          backgroundColor: 'rgb(0, 0, 0)',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          border: '0.5px solid rgba(255, 255, 255, 0.1)',
          backgroundImage: 'none',
        },
      },
    },  
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
