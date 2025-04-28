import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Borrow, Book, User, Bill } from '../../types';
import BillModal from '../../components/BillModal';
import { useAuth } from '../../contexts/AuthContext';

const GenerateBill: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [borrow, setBorrow] = useState<Borrow | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [lateFee, setLateFee] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [generatedBill, setGeneratedBill] = useState<Bill | null>(null);
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    const fetchBorrowDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the borrow details
        const { data: borrowData } = await api.get<Borrow>(`/borrow/${id}`);
        setBorrow(borrowData);
        
        // Fetch book details if we only have the ID
        if (borrowData.bookId && typeof borrowData.bookId === 'string') {
          const { data: bookData } = await api.get<Book>(`/books/${borrowData.bookId}`);
          setBook(bookData);
        } else if (borrowData.bookId) {
          // If the book data is already populated in the borrow data
          setBook(borrowData.bookId as unknown as Book);
        }
        
        // Fetch user details if we only have the ID
        if (borrowData.userId && typeof borrowData.userId === 'string') {
          const { data: userData } = await api.get<User>(`/users/${borrowData.userId}`);
          setUser(userData);
        } else if (borrowData.userId) {
          // If the user data is already populated in the borrow data
          setUser(borrowData.userId as unknown as User);
        }
        
        // Set generated bill if it exists
        if (borrowData.bill) {
          setGeneratedBill(borrowData.bill);
          setLateFee(borrowData.bill.lateFee || 0);
        }
        
      } catch (err) {
        console.error('Error fetching borrow details:', err);
        setError('Failed to fetch borrow details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBorrowDetails();
  }, [id]);
  
  const handleGenerateBill = async () => {
    if (!id) return;
    
    setGenerating(true);
    try {
      const { data } = await api.post(`/borrow/${id}/bill`, {
        lateFee: lateFee
      });
      setGeneratedBill(data.bill);
      // Update the borrow with the new bill
      setBorrow({
        ...borrow!,
        bill: data.bill
      });
      setShowBillModal(true);
      setGenerating(false);
    } catch (err) {
      console.error('Error generating bill:', err);
      setError('Failed to generate bill. Please try again.');
      setGenerating(false);
    }
  };
  
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">You do not have permission to access this page.</p>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        {error}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-block mt-2 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!borrow) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        Borrow record not found.
        <button 
          onClick={() => navigate(-1)} 
          className="inline-block mt-2 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  // Check if the book has been returned
  if (!borrow.returnDate) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Generate Bill</h1>
        <div className="p-4 mb-6 text-yellow-700 bg-yellow-100 rounded-md">
          <p>This book has not been returned yet. A bill can only be generated after a book is returned.</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  // Add null check for book before using it
  const returnDate = borrow.returnDate ? new Date(borrow.returnDate) : null;
  
  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Generate Bill</h1>
      
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Borrow Details</h2>
        
        {/* Book and User Information */}
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="mb-2 text-lg font-medium text-gray-800">Book Information</h3>
            {book ? (
              <div>
                <p className="font-medium">{book.title}</p>
                <p className="text-gray-600">by {book.author}</p>
                <p className="text-gray-600">ISBN: {book.ISBN}</p>
                <p className="mt-2 text-gray-600">Daily Charge: ${book.chargePerDay.toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-gray-600">Book information not available</p>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="mb-2 text-lg font-medium text-gray-800">Member Information</h3>
            {user ? (
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
              </div>
            ) : (
              <p className="text-gray-600">Member information not available</p>
            )}
          </div>
        </div>
        
        {/* Borrow Dates */}
        <div className="p-4 mb-6 bg-gray-50 rounded-md">
          <h3 className="mb-2 text-lg font-medium text-gray-800">Borrow Timeline</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-gray-500">Borrowed Date</p>
              <p className="font-medium">{new Date(borrow.borrowDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Due Date</p>
              <p className="font-medium">{new Date(borrow.borrowedTill).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Return Date</p>
              <p className="font-medium">{new Date(borrow.returnDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Bill Generation Form */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">
            {generatedBill ? 'Bill Details' : 'Generate Bill'}
          </h3>
          
          {borrow.returnDate && new Date(borrow.returnDate) > new Date(borrow.borrowedTill) && (
            <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-700">Late Return Detected</h4>
              <p className="mt-1 text-sm">
                This book was returned {returnDate && new Date(borrow.borrowedTill) ? 
                  Math.ceil((returnDate.getTime() - new Date(borrow.borrowedTill).getTime()) / (1000 * 3600 * 24)) : 0} days late.
              </p>
              <p className="mt-1 text-sm">
                Late Fee Calculation: 5 × Daily Charge × Days Late
              </p>
              {book && (
                <p className="mt-1 text-sm">
                  = 5 × ${book.chargePerDay.toFixed(2)} × {returnDate && new Date(borrow.borrowedTill) ? 
                    Math.ceil((returnDate.getTime() - new Date(borrow.borrowedTill).getTime()) / (1000 * 3600 * 24)) : 0} days
                  = ${(5 * book.chargePerDay * Math.ceil((returnDate!.getTime() - new Date(borrow.borrowedTill).getTime()) / (1000 * 3600 * 24))).toFixed(2)}
                </p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="lateFee" className="block mb-2 text-sm font-medium text-gray-700">
              Late Fee Amount ($)
            </label>
            <input
              type="number"
              id="lateFee"
              min="0"
              step="0.01"
              value={lateFee}
              onChange={(e) => setLateFee(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={!!generatedBill}
            />
            <p className="mt-1 text-sm text-gray-500">
              {generatedBill ? 
                'Late fee was automatically calculated based on days late.' :
                'The system will automatically calculate late fees (5× daily charge × days late), but you can adjust it here if needed.'}
            </p>
          </div>
          
          {generatedBill && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-700">Bill Generated Successfully</h4>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <p className="text-gray-600">Base Amount:</p>
                <p className="font-medium">${generatedBill.amount.toFixed(2)}</p>
                <p className="text-gray-600">Late Fee:</p>
                <p className="font-medium">${generatedBill.lateFee.toFixed(2)}</p>
                <p className="text-gray-600">Total:</p>
                <p className=" font-bold">${generatedBill.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {generatedBill ? 'Back to Borrowings' : 'Cancel'}
            </button>
            
            {!generatedBill && (
              <button
                onClick={handleGenerateBill}
                disabled={generating}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {generating ? 'Processing...' : 'Generate Bill'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bill Modal */}
      {generatedBill && borrow && book && (
        <BillModal
          isOpen={showBillModal}
          onClose={() => setShowBillModal(false)}
          bill={generatedBill}
          borrow={borrow}
          book={book}
        />
      )}
    </div>
  );
};

export default GenerateBill; 