"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { User } from "../../types";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "blocked">("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<User[]>("/users");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      await api.put(`/users/${userId}/block`);

      // Update user status locally
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      setError("Failed to update user status. Please try again later.");
    }
  };

  const handleSendReminder = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/remind`, {
        message: "Please return your borrowed books as soon as possible.",
      });

      alert("Reminder sent successfully!");
    } catch (error) {
      console.error("Error sending reminder:", error);
      setError("Failed to send reminder. Please try again later.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "active") return matchesSearch && !user.isBlocked;
    if (filter === "blocked") return matchesSearch && user.isBlocked;

    return matchesSearch;
  });

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Manage Users</h1>

      <div className="p-4 mb-6 bg-white rounded-[10px] shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              className="block w-full mt-1 border-gray-300 rounded-[10px] shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <label
              htmlFor="filter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter
            </label>
            <select
              id="filter"
              className="block w-full mt-1 border-gray-300 rounded-[10px] shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "active" | "blocked")
              }
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="blocked">Blocked Users</option>
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
      ) : filteredUsers.length === 0 ? (
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
          <p className="mt-4 text-lg font-medium">No users found</p>
          <p className="mt-2">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-[10px] shadow-sm border border-blue-200">
          {" "}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Created At
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() =>
                            handleBlockUser(user._id, !!user.isBlocked)
                          }
                          className={
                            user.isBlocked
                              ? "text-green-600 hover:text-green-900"
                              : "text-red-600 hover:text-red-900"
                          }
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleSendReminder(user._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Remind
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
