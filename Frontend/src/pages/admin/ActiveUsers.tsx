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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { User } from '../../types';
import api from '../../utils/api';

export default function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reminderMessage, setReminderMessage] = useState('');

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const { data } = await api.get('/api/users/active');
      setActiveUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch active users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (!selectedUser) return;

    try {
      await api.post(`/api/users/${selectedUser.id}/remind`, {
        message: reminderMessage,
      });
      setOpenDialog(false);
      setReminderMessage('');
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reminder');
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await api.put(`/api/users/${userId}/block`);
      fetchActiveUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to block user');
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
        Active Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenDialog(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Send Reminder
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleBlockUser(user.id)}
                  >
                    Block
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Send Reminder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reminder Message"
            fullWidth
            multiline
            rows={4}
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSendReminder} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 