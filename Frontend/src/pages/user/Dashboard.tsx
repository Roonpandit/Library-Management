import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { UserDashboardData, Book, Borrow } from "../../types";
import BookCard from "../../components/BookCard";
import BorrowCard from "../../components/BorrowCard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(
    null
  );
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [currentBorrows, setCurrentBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data: stats } = await api.get<UserDashboardData>(
          "/dashboard/user"
        );
        setDashboardData(stats);

        const { data: books } = await api.get<Book[]>("/dashboard/user/books");
        setRecentBooks(books.slice(0, 4));

        const { data: borrows } = await api.get<Borrow[]>(
          "/dashboard/user/borrowed"
        );
        setCurrentBorrows(borrows.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleReturn = async (borrowId: string) => {
    try {
      setCurrentBorrows(
        currentBorrows.map((borrow) =>
          borrow._id === borrowId
            ? { ...borrow, returnDate: new Date().toISOString() }
            : borrow
        )
      );

      const { data: stats } = await api.get<UserDashboardData>(
        "/dashboard/user"
      );
      setDashboardData(stats);
    } catch (error) {
      console.error("Error updating borrow status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-[10px] shadow-sm hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 text-blue-900 rounded-full">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Books</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.totalBooks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[10px] shadow-sm hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 text-green-600 rounded-full">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Currently Borrowed
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.totalBorrowed || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[10px] shadow-sm hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 text-yellow-600 rounded-full">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Overdue Returns
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.overdueReturns || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[10px] shadow-sm hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 text-purple-600 rounded-full">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Returned Books
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.returned || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Books</h2>
          <Link
            to="/books"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        </div>

        {recentBooks.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm">
            <p>No books available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Current Borrows</h2>
          <Link
            to="/borrows"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        </div>

        {currentBorrows.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm">
            <p>You haven't borrowed any books yet.</p>
            <Link
              to="/books"
              className="inline-block mt-2 text-blue-600 hover:text-blue-800"
            >
              Browse books to borrow
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentBorrows.map((borrow) => (
              <BorrowCard
                key={borrow._id}
                borrow={borrow}
                onReturn={handleReturn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
