import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { User } from '../../types';
import api from '../../utils/api';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await api.put(`/api/users/${userId}/block`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to block user');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await api.put(`/api/users/${userId}/unblock`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unblock user');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>
                  {user.isBlocked ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleBlockUser(user.id)}
                    >
                      Block
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 