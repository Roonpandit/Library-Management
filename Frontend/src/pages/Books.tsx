"use client"

import { useState, useEffect } from "react"
import { api } from "../services/api"
import type { Book } from "../types"
import BookCard from "../components/BookCard"

const Books = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<Book[]>("/books")
        setBooks(data)

        // Extract unique genres
        const uniqueGenres = Array.from(new Set(data.map((book) => book.genre)))
        setGenres(uniqueGenres)
      } catch (error) {
        console.error("Error fetching books:", error)
        setError("Failed to fetch books. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genre === "" || book.genre === genre
    return matchesSearch && matchesGenre
  })

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Browse Books</h1>

      <div className="p-4 mb-6 bg-white rounded-[10px] border border-blue-200 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      ) : filteredBooks.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Books
