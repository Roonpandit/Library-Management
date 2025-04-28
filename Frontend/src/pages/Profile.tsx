import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import { RootState } from '../store';
import api from '../utils/api';
import { Borrow, Notification } from '../types';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Profile() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchBorrows();
    fetchNotifications();
  }, []);

  const fetchBorrows = async () => {
    try {
      const { data } = await api.get('/api/borrow/user');
      setBorrows(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch borrowed books');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/api/auth/profile');
      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    }
  };

  const handleReturn = async (borrowId: string) => {
    try {
      await api.put(`/api/borrow/${borrowId}/return`);
      fetchBorrows();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      await api.put(`/api/users/${user?.id}/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Typography>
          <strong>Name:</strong> {user?.name}
        </Typography>
        <Typography>
          <strong>Email:</strong> {user?.email}
        </Typography>
        <Typography>
          <strong>Role:</strong> {user?.role}
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <Paper sx={{ mb: 3 }}>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification._id}
              sx={{
                backgroundColor: notification.read ? 'inherit' : 'action.hover',
              }}
            >
              <ListItemText
                primary={notification.message}
                secondary={format(new Date(notification.date), 'PPP')}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleMarkNotificationAsRead(notification._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          )}
        </List>
      </Paper>

      <Typography variant="h5" gutterBottom>
        My Borrowed Books
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrows.map((borrow) => {
              const isOverdue =
                !borrow.returnDate &&
                new Date(borrow.dueDate) < new Date();

              return (
                <TableRow key={borrow.id}>
                  <TableCell>{borrow.book.title}</TableCell>
                  <TableCell>
                    {format(new Date(borrow.borrowDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(borrow.dueDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {borrow.returnDate
                      ? format(new Date(borrow.returnDate), 'MMM dd, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {borrow.returnDate ? (
                      <Chip
                        label={borrow.status === 'returned' ? 'Returned' : 'Pending'}
                        color={borrow.status === 'returned' ? 'success' : 'warning'}
                      />
                    ) : (
                      <Chip
                        label={isOverdue ? 'Overdue' : 'Active'}
                        color={isOverdue ? 'error' : 'primary'}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {!borrow.returnDate && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleReturn(borrow.id)}
                      >
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {borrows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No borrowed books found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 