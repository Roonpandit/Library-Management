"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { api } from "../services/api"
import type { Book } from "../types"
import { useAuth } from "../contexts/AuthContext"

const BookDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [borrowDate, setBorrowDate] = useState<string>("")
  const [borrowLoading, setBorrowLoading] = useState(false)
  const [borrowError, setBorrowError] = useState<string | null>(null)
  const [borrowSuccess, setBorrowSuccess] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<Book>(`/books/${id}`)
        setBook(data)
      } catch (error) {
        console.error("Error fetching book:", error)
        setError("Failed to fetch book details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBook()
    }
  }, [id])

  const handleBorrow = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (!borrowDate) {
      setBorrowError("Please select a return date")
      return
    }

    try {
      setBorrowLoading(true)
      setBorrowError(null)
      await api.post("/borrow", {
        bookId: id,
        borrowedTill: borrowDate,
      })
      setBorrowSuccess(true)

      // Update book copies
      if (book) {
        setBook({
          ...book,
          copiesAvailable: book.copiesAvailable - 1,
        })
      }
    } catch (error) {
      console.error("Error borrowing book:", error)
      setBorrowError("Failed to borrow the book. Please try again later.")
    } finally {
      setBorrowLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return
    }

    try {
      setLoading(true)
      await api.delete(`/books/${id}`)
      navigate("/admin/books")
    } catch (error) {
      console.error("Error deleting book:", error)
      setError("Failed to delete the book. Please try again later.")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (error || !book) {
    return <div className="p-4 text-red-700 bg-red-100 rounded-md">{error || "Book not found"}</div>
  }

  // Calculate minimum date (today) for the borrow date picker
  const today = new Date()
  const minDate = today.toISOString().split("T")[0]

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link to="/books" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Books
        </Link>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="md:flex">
          <div className="w-full md:w-1/3 bg-gray-200">
            {book.imageUrl ? (
              <img src={book.imageUrl || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full min-h-[300px] text-gray-500">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="w-full p-6 md:w-2/3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-lg text-gray-600">by {book.author}</p>
              </div>
              {user?.role === "admin" && (
                <div className="flex space-x-2">
                  <Link to={`/admin/books/edit/${book._id}`} className="btn btn-secondary text-sm py-1">
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="btn btn-danger text-sm py-1">
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500">ISBN</p>
                <p className="font-medium">{book.ISBN}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Published Date</p>
                <p className="font-medium">{new Date(book.publishedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Genre</p>
                <p className="font-medium">{book.genre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Charge per Day</p>
                <p className="font-medium">${book.chargePerDay.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className={`font-medium ${book.copiesAvailable > 0 ? "text-green-600" : "text-red-600"}`}>
                  {book.copiesAvailable > 0 ? `${book.copiesAvailable} copies available` : "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600">{book.description}</p>
            </div>

            {user && book.copiesAvailable > 0 && !borrowSuccess && (
              <div className="p-4 mt-6 border border-gray-200 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">Borrow this Book</h2>

                {borrowError && <div className="p-2 mt-2 text-sm text-red-700 bg-red-100 rounded">{borrowError}</div>}

                <div className="mt-4">
                  <label htmlFor="borrow-date" className="block text-sm font-medium text-gray-700">
                    Return By
                  </label>
                  <input
                    type="date"
                    id="borrow-date"
                    min={minDate}
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="mt-4">
                  <button onClick={handleBorrow} disabled={borrowLoading} className="btn btn-primary">
                    {borrowLoading ? "Processing..." : "Borrow Now"}
                  </button>
                </div>
              </div>
            )}

            {borrowSuccess && (
              <div className="p-4 mt-6 text-green-700 bg-green-100 rounded-md">
                <h2 className="text-lg font-medium">Book Borrowed Successfully!</h2>
                <p className="mt-2">
                  You have successfully borrowed this book. Please return it by{" "}
                  {new Date(borrowDate).toLocaleDateString()}.
                </p>
                <div className="mt-4">
                  <Link to="/borrows" className="text-green-700 underline hover:text-green-900">
                    View My Borrows
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
