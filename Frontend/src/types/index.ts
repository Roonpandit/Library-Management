export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  notifications: Notification[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  ISBN: string;
  quantity: number;
  publishedDate: string;
  genre: string;
  copiesAvailable: number;
  chargePerDay: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Borrow {
  id: string;
  user: User;
  book: Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  fineAmount?: number;
}

export interface Notification {
  _id: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardData {
  totalBooks: number;
  totalBorrowed: number;
  overdueReturns: number;
  returned: number;
}

export interface AdminDashboardData {
  activeUsers: number;
  totalBooks: number;
  overduePayments: number;
  blockedUsers: number;
  returnedBooks: number;
} 