import { useState, useEffect } from "react";
import { api } from "../../services/api";
import type { Borrow } from "../../types";
import BorrowCard from "../../components/BorrowCard";

const Overdue = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Borrow[]>("/dashboard/user/overdue");
        setBorrows(data);
      } catch (error) {
        console.error("Error fetching overdue books:", error);
        setError("Failed to fetch overdue books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueBooks();
  }, []);

  const handleReturn = async (borrowId: string) => {
    try {
      setBorrows(borrows.filter((borrow) => borrow._id !== borrowId));
    } catch (error) {
      console.error("Error updating borrow status:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Overdue Books</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      ) : borrows.length === 0 ? (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium">No overdue books</p>
          <p className="mt-2">You don't have any overdue books. Great job!</p>
        </div>
      ) : (
        <div>
          <div className="p-4 mb-6 text-yellow-800 bg-yellow-100 rounded-md">
            <div className="flex">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-medium">Attention!</p>
                <p className="text-sm">
                  You have {borrows.length} overdue{" "}
                  {borrows.length === 1 ? "book" : "books"}. Please return them
                  as soon as possible to avoid additional fees.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {borrows.map((borrow) => (
              <BorrowCard
                key={borrow._id}
                borrow={borrow}
                onReturn={handleReturn}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overdue;
