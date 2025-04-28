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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Borrow } from '../../types';
import api from '../../utils/api';

export default function ReturnedBooks() {
  const [returnedBorrows, setReturnedBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReturnedBorrows();
  }, []);

  const fetchReturnedBorrows = async () => {
    try {
      const { data } = await api.get('/api/borrow/returned');
      setReturnedBorrows(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch returned books');
    } finally {
      setIsLoading(false);
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
        Returned Books
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returnedBorrows.map((borrow) => (
              <TableRow key={borrow.id}>
                <TableCell>{borrow.user.name}</TableCell>
                <TableCell>{borrow.book.title}</TableCell>
                <TableCell>{new Date(borrow.borrowDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(borrow.returnDate).toLocaleDateString()}</TableCell>
                <TableCell>{borrow.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 