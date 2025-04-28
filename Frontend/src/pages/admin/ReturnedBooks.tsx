"use client"

import { useState, useEffect } from "react"
import { api } from "../../services/api"
import type { Borrow } from "../../types"
import BorrowCard from "../../components/BorrowCard"

const ReturnedBooks = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<Borrow[]>("/dashboard/admin/returned-books")
        setBorrows(data)
      } catch (error) {
        console.error("Error fetching returned books:", error)
        setError("Failed to fetch returned books. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReturnedBooks()
  }, [])

  const handleUpdatePayment = async (borrowId: string) => {
    try {
      // Update the borrow status locally
      setBorrows(borrows.map((borrow) => (borrow._id === borrowId ? { ...borrow, paymentStatus: "paid" } : borrow)))
    } catch (error) {
      console.error("Error updating payment status:", error)
    }
  }

  const handleGenerateBill = async (bill: String) => {
    try {
      // No need to update the UI as the BorrowCard component will show the bill
      console.log("Bill generated:", bill)
    } catch (error) {
      console.error("Error generating bill:", error)
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Returned Books</h1>

      {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : borrows.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium">No returned books</p>
          <p className="mt-2">There are no returned books at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {borrows.map((borrow) => (
            <BorrowCard
              key={borrow._id}
              borrow={borrow}
              onUpdatePayment={handleUpdatePayment}
              onGenerateBill={handleGenerateBill}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReturnedBooks
