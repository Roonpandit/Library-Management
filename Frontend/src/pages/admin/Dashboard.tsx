"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { AdminDashboardData, User, Book, Borrow } from "../../types";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null
  );
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [overduePayments, setOverduePayments] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const { data: stats } = await api.get<AdminDashboardData>(
          "/dashboard/admin"
        );
        setDashboardData(stats);

        // Fetch active users
        const { data: users } = await api.get<User[]>(
          "/dashboard/admin/active-users"
        );
        setActiveUsers(users.slice(0, 5)); // Show only 5 active users

        // Fetch recent books
        const { data: books } = await api.get<Book[]>("/dashboard/admin/books");
        setRecentBooks(books.slice(0, 5)); // Show only 5 recent books

        // Fetch overdue payments
        const { data: borrows } = await api.get<Borrow[]>(
          "/dashboard/admin/overdue-payments"
        );
        setOverduePayments(borrows.slice(0, 5)); // Show only 5 overdue payments
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-5">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Active Users
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.activeUsers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[10px] shadow-sm hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
          {" "}
          <div className="flex items-center">
            <div className="p-3 text-green-700 rounded-full">
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
          {" "}
          <div className="flex items-center">
            <div className="p-3 text-yellow-700 rounded-full">
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
                Overdue Payments
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.overduePayments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[10px] shadow-sm hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
          {" "}
          <div className="flex items-center">
            <div className="p-3 text-red-600 rounded-full">
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
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <div className="ml-4 ">
              {" "}
              <h2 className="text-sm font-medium text-gray-600">
                Blocked Users
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.blockedUsers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-[10px] shadow-sm hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
          {" "}
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
                {dashboardData?.returnedBooks || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Users */}
        <div className="bg-white rounded-[10px] shadow-sm border border-blue-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Active Users</h2>
            <Link
              to="/admin/active-users"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>

          <div className="p-4">
            {activeUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No active users at the moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {activeUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-200 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to={`/admin/users/${user._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Books */}
        <div className="bg-white rounded-[10px] shadow-sm border border-blue-200">

          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recent Books</h2>
            <Link
              to="/admin/books"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>

          <div className="p-4">
            {recentBooks.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No books available at the moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentBooks.map((book) => (
                  <div
                    key={book._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                        {book.imageUrl ? (
                          <img
                            src={book.imageUrl || "/placeholder.svg"}
                            alt={book.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-500">
                            <svg
                              className="w-6 h-6"
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
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {book.author}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          book.copiesAvailable > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.copiesAvailable} copies
                      </span>
                      <Link
                        to={`/books/${book._id}`}
                        className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white rounded-[10px] shadow-sm lg:col-span-2 border border-blue-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Overdue Payments
            </h2>
            <Link
              to="/admin/overdue-payments"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>

          <div className="p-4">
            {overduePayments.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No overdue payments at the moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Book
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Borrowed Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Due Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overduePayments.map((borrow) => {
                      const user =
                        typeof borrow.userId === "string"
                          ? null
                          : (borrow.userId as unknown as User);

                      const book =
                        typeof borrow.bookId === "string"
                          ? null
                          : (borrow.bookId as unknown as Book);

                      return (
                        <tr key={borrow._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user ? (
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-200 flex items-center justify-center text-white font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">
                                User not available
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {book ? (
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">
                                  {book.title}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-500">
                                Book not available
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">
                              {new Date(borrow.borrowDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-red-600 font-medium">
                              {new Date(
                                borrow.borrowedTill
                              ).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Overdue
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <Link
                              to={`/admin/borrows`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
