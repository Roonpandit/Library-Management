import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Book } from "../../types";
import BookCard from "../../components/BookCard";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Book[]>("/books");
        setBooks(data);

        const uniqueGenres = Array.from(
          new Set(data.map((book) => book.genre))
        );
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Failed to delete the book. Please try again later.");
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genre === "" || book.genre === genre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
        <Link to="/admin/books/add" className="btn btn-primary">
          Add New Book
        </Link>
      </div>

      <div className="p-4 mb-6 bg-white rounded-[10px] shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 rounded-[10px] "
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              className="block w-full mt-1 border-gray-300 rounded-[10px] shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by title or author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Genre
            </label>
            <select
              id="genre"
              className="block w-full mt-1 border-gray-300 rounded-[10px] shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium">No books found</p>
          <p className="mt-2">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="relative overflow-hidden bg-white rounded-lg shadow-sm"
            >
              <div className="absolute top-2 right-2 flex space-x-1">
                <Link
                  to={`/admin/books/edit/${book._id}`}
                  className="p-1 text-white hover:text-blue-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="p-1 text-white hover:text-red-600"
                  title="Delete"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
