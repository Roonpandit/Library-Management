"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "../../services/api"
import type { User, Borrow, Notification } from "../../types"
import BorrowCard from "../../components/BorrowCard"

interface UserWithBorrows extends User {
  borrowedBooks?: any[];
}

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserWithBorrows | null>(null)
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reminderMessage, setReminderMessage] = useState("")
  const [sendingReminder, setSendingReminder] = useState(false)
  const [reminderSuccess, setReminderSuccess] = useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<UserWithBorrows>(`/users/${id}`)
        
        // Sort notifications in user data if they exist
        if (data.notifications && data.notifications.length > 0) {
          data.notifications.sort((a: Notification, b: Notification) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        }
        
        setUser(data)

        // Extract borrows from the user data and sort by most recent first
        if (data.borrowedBooks && Array.isArray(data.borrowedBooks)) {
          // Sort borrowed books by borrowDate in descending order (newest first)
          const sortedBorrows = [...data.borrowedBooks].sort((a, b) => {
            return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
          });
          setBorrows(sortedBorrows as unknown as Borrow[]);
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
        setError("Failed to fetch user details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserDetails()
    }
  }, [id])

  const handleBlockUser = async () => {
    if (!user) return

    try {
      await api.put(`/users/${id}/block`)

      // Update user status locally
      setUser({
        ...user,
        isBlocked: !user.isBlocked,
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      setError("Failed to update user status. Please try again later.")
    }
  }

  const handleSendReminder = async () => {
    if (!reminderMessage.trim()) {
      setError("Please enter a reminder message")
      return
    }

    try {
      setSendingReminder(true)
      setError(null)
      setReminderSuccess(false)

      await api.post(`/users/${id}/remind`, {
        message: reminderMessage,
      })

      setReminderSuccess(true)
      setReminderMessage("")
    } catch (error) {
      console.error("Error sending reminder:", error)
      setError("Failed to send reminder. Please try again later.")
    } finally {
      setSendingReminder(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (error && !user) {
    return <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
  }

  if (!user) {
    return <div className="p-4 text-red-700 bg-red-100 rounded-md">User not found</div>
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link to="/admin/users" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Users
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Information */}
        <div className="md:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <p className="text-gray-500">Role</p>
                <p className="font-medium">{user.role}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className={`font-medium ${user.isBlocked ? "text-red-600" : "text-green-600"}`}>
                  {user.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Created At</p>
                <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleBlockUser} className={user.isBlocked ? "btn btn-success" : "btn btn-danger"}>
                {user.isBlocked ? "Unblock User" : "Block User"}
              </button>
            </div>
          </div>

          {/* Send Reminder */}
          <div className="p-6 mt-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Send Reminder</h3>

            {error && <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}

            {reminderSuccess && (
              <div className="p-3 mt-4 text-sm text-green-700 bg-green-100 rounded-md">Reminder sent successfully!</div>
            )}

            <div className="mt-4">
              <label htmlFor="reminder" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="reminder"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={3}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter reminder message..."
              ></textarea>
            </div>

            <div className="mt-4">
              <button onClick={handleSendReminder} disabled={sendingReminder} className="btn btn-primary w-full">
                {sendingReminder ? "Sending..." : "Send Reminder"}
              </button>
            </div>
          </div>
        </div>

        {/* Borrowed Books */}
        <div className="md:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Borrowed Books</h3>

            <div className="mt-4">
              {borrows.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>This user hasn't borrowed any books yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {borrows.map((borrow) => (
                    <BorrowCard key={borrow._id} borrow={borrow} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6 mt-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>

            <div className="mt-4">
              {user.notifications && user.notifications.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {user.notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border rounded-md ${notification.read ? "bg-white" : "bg-blue-50"}`}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">{notification.message}</p>
                        <span
                          className={`text-xs ${notification.read ? "text-gray-500" : "text-blue-600 font-medium"}`}
                        >
                          {notification.read ? "Read" : "Unread"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No notifications for this user.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
