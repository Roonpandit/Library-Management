import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid as MuiGrid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Book } from '../types';
import { RootState } from '../store';
import api from '../utils/api';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [borrowDate, setBorrowDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/api/books');
      setBooks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedBook || !borrowDate) return;

    try {
      await api.post('/api/borrow', {
        bookId: selectedBook._id,
        borrowedTill: borrowDate.toISOString(),
      });
      setOpenDialog(false);
      fetchBooks(); // Refresh books list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to borrow book');
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
        Available Books
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <MuiGrid container spacing={3}>
        {books.map((book) => (
          <MuiGrid key={book._id} item xs={12} sm={6} md={4}>
            <Card>
              {book.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={book.imageUrl}
                  alt={book.title}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre: {book.genre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available Copies: {book.copiesAvailable}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Charge per Day: ${book.chargePerDay}
                </Typography>
                {book.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {book.description}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={book.copiesAvailable === 0}
                  onClick={() => {
                    setSelectedBook(book);
                    setOpenDialog(true);
                  }}
                >
                  {book.copiesAvailable === 0 ? 'Not Available' : 'Borrow'}
                </Button>
              </CardContent>
            </Card>
          </MuiGrid>
        ))}
      </MuiGrid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {selectedBook?.title}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Return Date"
              value={borrowDate}
              onChange={(newValue: Date | null) => setBorrowDate(newValue)}
              minDate={new Date()}
              sx={{ mt: 2, width: '100%' }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleBorrow} variant="contained" disabled={!borrowDate}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 