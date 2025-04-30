import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useState, useRef, useEffect } from "react"
import { api } from "../services/api"
import type { Notification } from "../types"

interface NavbarProps {
  onMenuClick: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onLogout }) => {
  const { user, logout: authLogout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate();

  // Use the provided onLogout function or fall back to the auth context logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    // First clear the auth state
    authLogout();
    };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const { data } = await api.get("/auth/profile")
          if (data.notifications) {
            // Sort notifications by date in descending order (newest first)
            const sortedNotifications = [...data.notifications].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setNotifications(sortedNotifications)
            setUnreadCount(sortedNotifications.filter((n: Notification) => !n.read).length)
          }
        } catch (error) {
          console.error("Failed to fetch notifications", error)
        }
      }
    }

    fetchNotifications()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/users/notifications/${id}`)
      setNotifications(
        notifications.map((notification) => (notification._id === id ? { ...notification, read: true } : notification)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read", error)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md md:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center flex-shrink-0 ml-2 md:ml-0">
              <Link to="/" className="flex items-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="ml-2 text-2xl font-bold text-gray-900" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
  BookNest
</span>

              </Link>
            </div>
          </div>

          {user ? (
            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative ml-3" ref={notificationsRef}>
                <button
                  type="button"
                  className="relative p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 z-10 w-80 mt-2 origin-top-right bg-white rounded-[10px] shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-2 px-2 ">
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                        Notifications
                      </div>
                      <div className="max-h-60 overflow-y-auto rounded-[10px]">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              className={`px-4 py-2 text-sm ${notification.read ? "bg-white" : "bg-blue-50"}`}
                            >
                              <div className="flex justify-between">
                                <p className="font-medium text-gray-900">{notification.message}</p>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification._id)}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {new Date(notification.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-200 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-[10px] shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          handleLogout()
                          navigate("/")
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Link to="/login" className="btn btn-secondary mr-2">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
