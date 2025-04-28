import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Members from './pages/Members'
import Transactions from './pages/Transactions'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import { useAuth } from "./contexts/AuthContext"
import { Navigate } from "react-router-dom"
import UserDashboard from "./pages/user/Dashboard"
import AdminDashboard from "./pages/admin/Dashboard"
import BookDetails from "./pages/BookDetails"
import UserProfile from "./pages/user/Profile"
import UserBorrows from "./pages/user/Borrows"
import UserReturned from "./pages/user/Returned"
import UserOverdue from "./pages/user/Overdue"
import AdminUsers from "./pages/admin/Users"
import AdminBooks from "./pages/admin/Books"
import AdminBorrows from "./pages/admin/Borrows"
import AdminOverduePayments from "./pages/admin/OverduePayments"
import AdminBlockedUsers from "./pages/admin/BlockedUsers"
import AdminReturnedBooks from "./pages/admin/ReturnedBooks"
import AdminActiveUsers from "./pages/admin/ActiveUsers"
import AddBook from "./pages/admin/AddBook"
import EditBook from "./pages/admin/EditBook"
import UserDetails from "./pages/admin/UserDetails"
import NotFound from "./pages/NotFound"
import GenerateBill from "./pages/admin/GenerateBill"

function App() {
  const { user, loading } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Handle login logic
  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  // Handle logout logic
  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <Dashboard />
            </Layout>
          } 
        />
        <Route 
          path="/books" 
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <Books />
            </Layout>
          } 
        />
        <Route 
          path="/members" 
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <Members />
            </Layout>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <Transactions />
            </Layout>
          } 
        />
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={user ? user.role === "admin" ? <AdminDashboard /> : <UserDashboard /> : <Navigate to="/login" />}
          />
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<BookDetails />} />

          {/* User Routes */}
          <Route path="profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
          <Route path="borrows" element={user ? <UserBorrows /> : <Navigate to="/login" />} />
          <Route path="returned" element={user ? <UserReturned /> : <Navigate to="/login" />} />
          <Route path="overdue" element={user ? <UserOverdue /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="admin/users" element={user?.role === "admin" ? <AdminUsers /> : <Navigate to="/" />} />
          <Route path="admin/users/:id" element={user?.role === "admin" ? <UserDetails /> : <Navigate to="/" />} />
          <Route path="admin/books" element={user?.role === "admin" ? <AdminBooks /> : <Navigate to="/" />} />
          <Route path="admin/books/add" element={user?.role === "admin" ? <AddBook /> : <Navigate to="/" />} />
          <Route path="admin/books/edit/:id" element={user?.role === "admin" ? <EditBook /> : <Navigate to="/" />} />
          <Route path="admin/borrows" element={user?.role === "admin" ? <AdminBorrows /> : <Navigate to="/" />} />
          <Route
            path="admin/overdue-payments"
            element={user?.role === "admin" ? <AdminOverduePayments /> : <Navigate to="/" />}
          />
          <Route
            path="admin/blocked-users"
            element={user?.role === "admin" ? <AdminBlockedUsers /> : <Navigate to="/" />}
          />
          <Route
            path="admin/returned-books"
            element={user?.role === "admin" ? <AdminReturnedBooks /> : <Navigate to="/" />}
          />
          <Route
            path="admin/active-users"
            element={user?.role === "admin" ? <AdminActiveUsers /> : <Navigate to="/" />}
          />
          <Route
            path="admin/generate-bill/:id"
            element={user?.role === "admin" ? <GenerateBill /> : <Navigate to="/" />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
