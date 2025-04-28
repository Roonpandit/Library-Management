import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RootState } from './store';
import { getProfile } from './store/slices/authSlice';
import theme from './theme';

// Lazy load components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import Layout from './components/Layout';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, token, user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={user?.role === 'admin' ? <Navigate to="/admin" /> : <Dashboard />} />
            <Route path="/books" element={user ? <Books /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </ThemeProvider>
  );
}

export default App;
