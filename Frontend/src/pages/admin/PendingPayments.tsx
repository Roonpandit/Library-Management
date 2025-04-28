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

export default function PendingPayments() {
  const [pendingBorrows, setPendingBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const { data } = await api.get('/api/borrow/pending-payment');
      setPendingBorrows(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (borrowId: string) => {
    try {
      await api.put(`/api/borrow/${borrowId}/pay`);
      fetchPendingPayments();
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
        Pending Payments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Fine Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingBorrows.map((borrow) => (
              <TableRow key={borrow.id}>
                <TableCell>{borrow.user.name}</TableCell>
                <TableCell>{borrow.book.title}</TableCell>
                <TableCell>
                  {borrow.returnDate
                    ? new Date(borrow.returnDate).toLocaleDateString()
                    : '-'}
                </TableCell>
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