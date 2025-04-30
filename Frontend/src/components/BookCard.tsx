import type React from "react"
import { Link } from "react-router-dom"
import type { Book } from "../types"

interface BookCardProps {
  book: Book
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
<div className="overflow-hidden bg-white shadow-sm rounded-[10px]">      {/* Removed fixed height container, letting image determine its own height */}
      <div className="bg-gray-200">
        {book.imageUrl ? (
          <img 
            src={book.imageUrl || "/placeholder.svg"} 
            alt={book.title} 
            className="w-full h-96" 
          />
        ) : (
          <div className="flex items-center justify-center w-full py-12 text-gray-500">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div className="p-4">
        
        <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600">by {book.author}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {book.genre}
          </span>
          <span className="text-sm font-medium text-gray-900">${book.chargePerDay}/day</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className={`text-sm font-medium ${book.copiesAvailable > 0 ? "text-green-600" : "text-red-600"}`}>
            {book.copiesAvailable > 0 ? `${book.copiesAvailable} available` : "Not available"}
          </span>
          <Link to={`/books/${book._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookCard