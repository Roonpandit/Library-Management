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
import { Borrow } from '../../types';
import api from '../../utils/api';

export default function OverduePayments() {
  const [overdueBorrows, setOverdueBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverdueBorrows();
  }, []);

  const fetchOverdueBorrows = async () => {
    try {
      const { data } = await api.get('/api/borrow/overdue');
      setOverdueBorrows(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch overdue borrows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (borrowId: string) => {
    try {
      await api.put(`/api/borrow/${borrowId}/pay`);
      fetchOverdueBorrows();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark as paid');
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
        Overdue Payments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Fine Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {overdueBorrows.map((borrow) => (
              <TableRow key={borrow.id}>
                <TableCell>{borrow.user.name}</TableCell>
                <TableCell>{borrow.book.title}</TableCell>
                <TableCell>{new Date(borrow.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>${borrow.fineAmount}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMarkAsPaid(borrow.id)}
                  >
                    Mark as Paid
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 