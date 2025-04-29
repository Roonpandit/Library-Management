export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  isBlocked?: boolean
  notifications?: Notification[]
  createdAt?: string
}

export interface AuthResponse {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  token: string
}

export interface Notification {
  _id: string
  message: string
  date: string
  read: boolean
}

export interface Book {
  _id: string
  title: string
  author: string
  ISBN: string
  publishedDate: string
  genre: string
  copiesAvailable: number
  chargePerDay: number
  description: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface Borrow {
  _id: string
  userId: string | User
  bookId: string | Book
  borrowDate: string
  borrowedTill: string
  returnDate: string | null
  paymentStatus: "pending" | "paid"
  createdAt: string
  bill?: Bill
}

export interface Bill {
  amount: number
  lateFee: number
  totalAmount: number
  isLate: boolean
  generatedDate?: string
  bookISBN?: string
}

export interface UserDashboardData {
  totalBooks: number
  totalBorrowed: number
  overdueReturns: number
  returned: number
}

export interface AdminDashboardData {
  activeUsers: number
  totalBooks: number
  overduePayments: number
  blockedUsers: number
  returnedBooks: number
}

export interface ApiError {
  message?: string
  errors?: { field: string; message: string }[]
}
