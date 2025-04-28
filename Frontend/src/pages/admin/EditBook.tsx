"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../../services/api"
import type { Book } from "../../types"

const EditBook = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [ISBN, setISBN] = useState("")
  const [publishedDate, setPublishedDate] = useState("")
  const [genre, setGenre] = useState("")
  const [copiesAvailable, setCopiesAvailable] = useState("")
  const [chargePerDay, setChargePerDay] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<Book>(`/books/${id}`)
        setBook(data)
        setTitle(data.title)
        setAuthor(data.author)
        setISBN(data.ISBN)
        setPublishedDate(new Date(data.publishedDate).toISOString().split("T")[0])
        setGenre(data.genre)
        setCopiesAvailable(data.copiesAvailable.toString())
        setChargePerDay(data.chargePerDay.toString())
        setDescription(data.description)
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setUpdating(true)
      setError(null)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("author", author)
      formData.append("ISBN", ISBN)
      formData.append("publishedDate", publishedDate)
      formData.append("genre", genre)
      formData.append("copiesAvailable", copiesAvailable)
      formData.append("chargePerDay", chargePerDay)
      formData.append("description", description)

      if (image) {
        formData.append("image", image)
      }

      await api.put(`/books/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate("/admin/books")
    } catch (error) {
      console.error("Error updating book:", error)
      setError("Failed to update book. Please try again later.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (error && !book) {
    return <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Book</h1>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author *
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="ISBN" className="block text-sm font-medium text-gray-700">
                ISBN *
              </label>
              <input
                type="text"
                id="ISBN"
                value={ISBN}
                onChange={(e) => setISBN(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700">
                Published Date *
              </label>
              <input
                type="date"
                id="publishedDate"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                Genre *
              </label>
              <input
                type="text"
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="copiesAvailable" className="block text-sm font-medium text-gray-700">
                Copies Available *
              </label>
              <input
                type="number"
                id="copiesAvailable"
                value={copiesAvailable}
                onChange={(e) => setCopiesAvailable(e.target.value)}
                min="0"
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="chargePerDay" className="block text-sm font-medium text-gray-700">
                Charge Per Day ($) *
              </label>
              <input
                type="number"
                id="chargePerDay"
                value={chargePerDay}
                onChange={(e) => setChargePerDay(e.target.value)}
                min="0"
                step="0.01"
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Cover Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {book?.imageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current image:</p>
                  <div className="w-20 h-20 mt-1 overflow-hidden bg-gray-100 rounded">
                    <img
                      src={book.imageUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button type="button" onClick={() => navigate("/admin/books")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={updating} className="btn btn-primary">
              {updating ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBook
