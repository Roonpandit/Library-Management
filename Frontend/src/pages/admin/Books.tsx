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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  IconButton,
} from '@mui/material';
import { Book } from '../../types';
import api from '../../utils/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    ISBN: '',
    quantity: 0,
    publishedDate: '',
    genre: '',
    copiesAvailable: 0,
    chargePerDay: 0,
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleAddBook = async () => {
    try {
      const formData = new FormData();
      Object.entries(newBook).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOpenDialog(false);
      setNewBook({
        title: '',
        author: '',
        ISBN: '',
        quantity: 0,
        publishedDate: '',
        genre: '',
        copiesAvailable: 0,
        chargePerDay: 0,
        description: '',
      });
      setImageFile(null);
      fetchBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleUpdateBook = async () => {
    if (!selectedBook) return;

    try {
      const formData = new FormData();
      Object.entries(newBook).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.put(`/api/books/${selectedBook.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOpenDialog(false);
      setSelectedBook(null);
      setNewBook({
        title: '',
        author: '',
        ISBN: '',
        quantity: 0,
        publishedDate: '',
        genre: '',
        copiesAvailable: 0,
        chargePerDay: 0,
        description: '',
      });
      setImageFile(null);
      fetchBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await api.delete(`/api/books/${bookId}`);
      fetchBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      quantity: book.quantity,
      publishedDate: book.publishedDate,
      genre: book.genre,
      copiesAvailable: book.copiesAvailable,
      chargePerDay: book.chargePerDay,
      description: book.description || '',
    });
    setOpenDialog(true);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Books</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedBook(null);
            setOpenDialog(true);
          }}
        >
          Add Book
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {books.map((book) => (
          <Box key={book.id}>
            <Card>
              {book.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={book.imageUrl}
                  alt={book.title}
                />
              )}
              <Box p={2}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography color="textSecondary">{book.author}</Typography>
                <Typography variant="body2" color="textSecondary">
                  ISBN: {book.ISBN}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Available: {book.copiesAvailable} / {book.quantity}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Charge per day: ${book.chargePerDay}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <IconButton onClick={() => handleEditBook(book)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteBook(book.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="ISBN"
                value={newBook.ISBN}
                onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Genre"
                value={newBook.genre}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Published Date"
                type="date"
                value={newBook.publishedDate}
                onChange={(e) =>
                  setNewBook({ ...newBook, publishedDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newBook.quantity}
                onChange={(e) =>
                  setNewBook({ ...newBook, quantity: parseInt(e.target.value) })
                }
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Copies Available"
                type="number"
                value={newBook.copiesAvailable}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    copiesAvailable: parseInt(e.target.value),
                  })
                }
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Charge per Day"
                type="number"
                value={newBook.chargePerDay}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    chargePerDay: parseFloat(e.target.value),
                  })
                }
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newBook.description}
                onChange={(e) =>
                  setNewBook({ ...newBook, description: e.target.value })
                }
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Button
                variant="contained"
                component="label"
                fullWidth
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              {imageFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {imageFile.name}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={selectedBook ? handleUpdateBook : handleAddBook}
            color="primary"
          >
            {selectedBook ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 