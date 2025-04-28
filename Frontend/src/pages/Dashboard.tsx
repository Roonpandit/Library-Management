import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Library Management System</h1>
        <p className="mb-4">Please log in to access the dashboard</p>
        <Link to="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </Link>
      </div>
    )
  }

  // If user is logged in, redirect based on role
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Library Dashboard</h1>
      <p className="mb-6">
        Welcome back, <span className="font-medium">{user.name}</span>!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/books"
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-xl font-bold mb-2">Browse Books</h2>
          <p className="text-gray-600">Explore our collection of books</p>
        </Link>

        {user.role === 'user' && (
          <Link
            to="/borrows"
            className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold mb-2">My Borrowed Books</h2>
            <p className="text-gray-600">View your current borrowings</p>
          </Link>
        )}

        {user.role === 'admin' && (
          <Link
            to="/admin/books"
            className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold mb-2">Manage Books</h2>
            <p className="text-gray-600">Add, edit or remove books</p>
          </Link>
        )}

        {user.role === 'admin' && (
          <Link
            to="/admin/users"
            className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold mb-2">Manage Users</h2>
            <p className="text-gray-600">View and manage user accounts</p>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Dashboard 