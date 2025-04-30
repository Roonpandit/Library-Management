"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../../services/api"
import type { User } from "../../types"

const BlockedUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<User[]>("/users/blocked")
        setUsers(data)
      } catch (error) {
        console.error("Error fetching blocked users:", error)
        setError("Failed to fetch blocked users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBlockedUsers()
  }, [])

  const handleUnblockUser = async (userId: string) => {
    try {
      await api.put(`/users/${userId}/block`)

      // Update user status locally
      setUsers(users.filter((user) => user._id !== userId))
    } catch (error) {
      console.error("Error updating user status:", error)
      setError("Failed to update user status. Please try again later.")
    }
  }

  return (
    <div className="container mx-auto rounded-[10px] border border-blue-200 p-6 bg-white shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Blocked Users</h1>

      {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium">No blocked users</p>
          <p className="mt-2">There are no blocked users at the moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
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
                    Created At
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-200 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/users/${user._id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        <button
                          onClick={() => handleUnblockUser(user._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Unblock
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
  )
}

export default BlockedUsers
