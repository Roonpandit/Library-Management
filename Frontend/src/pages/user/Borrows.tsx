"use client"

import { useState, useEffect } from "react"
import { api } from "../../services/api"
import type { Borrow } from "../../types"
import BorrowCard from "../../components/BorrowCard"

const Borrows = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "current" | "returned">("all")

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<Borrow[]>("/borrow/user")
        setBorrows(data)
      } catch (error) {
        console.error("Error fetching borrows:", error)
        setError("Failed to fetch borrows. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBorrows()
  }, [])

  const handleReturn = async (borrowId: string) => {
    try {
      // Update the borrow status locally
      setBorrows(
        borrows.map((borrow) =>
          borrow._id === borrowId ? { ...borrow, returnDate: new Date().toISOString() } : borrow,
        ),
      )
    } catch (error) {
      console.error("Error updating borrow status:", error)
    }
  }

  const filteredBorrows = borrows.filter((borrow) => {
    if (filter === "current") return !borrow.returnDate
    if (filter === "returned") return !!borrow.returnDate
    return true
  })

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Borrows</h1>

      <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-[10px] ${
              filter === "all" ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("current")}
            className={`px-4 py-2 text-sm font-medium rounded-[10px] ${
              filter === "current" ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setFilter("returned")}
            className={`px-4 py-2 text-sm font-medium rounded-[10px] ${
              filter === "returned" ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Returned
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      ) : filteredBorrows.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium">No borrows found</p>
          <p className="mt-2">
            {filter === "all"
              ? "You haven't borrowed any books yet."
              : filter === "current"
                ? "You don't have any current borrows."
                : "You don't have any returned books."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBorrows.map((borrow) => (
            <BorrowCard key={borrow._id} borrow={borrow} onReturn={handleReturn} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Borrows
