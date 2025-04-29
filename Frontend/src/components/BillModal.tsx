import React, { useRef, useEffect } from 'react';
import type { Bill, Borrow, Book, User } from '../types';
import BillDetails from './BillDetails';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill;
  borrow?: Borrow;
  book?: Book;
  user?: User;
}

const BillModal: React.FC<BillModalProps> = ({ isOpen, onClose, bill, borrow, book, user }) => {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      console.log('BillModal - Book:', book);
      console.log('BillModal - Bill:', bill);
    }
  }, [isOpen, book, bill]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Get ISBN either from book object or bill object
  const isbn = book?.ISBN || bill.bookISBN;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Bill Receipt</h3>
                
                <div ref={printRef} className="p-4 bg-white">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Library Management System</h2>
                    <p className="text-sm text-gray-600">Book Rental Receipt</p>
                  </div>

                  {(book || borrow || user || isbn) && (
                    <div className="mb-6 text-sm">
                      {book && (
                        <div className="mb-2">
                          <p className="font-medium">Book: {book.title}</p>
                          <p className="text-gray-600">Author: {book.author}</p>
                          {isbn && <p className="text-gray-600">ISBN: {isbn}</p>}
                        </div>
                      )}
                      
                      {user && (
                        <div className="mb-2">
                          <p className="font-medium">Member: {user.name}</p>
                          <p className="text-gray-600">Email: {user.email}</p>
                        </div>
                      )}

                      {borrow && (
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-gray-600">Borrow Date:</p>
                          <p>{new Date(borrow.borrowDate).toLocaleDateString()}</p>
                          
                          <p className="text-gray-600">Due Date:</p>
                          <p>{new Date(borrow.borrowedTill).toLocaleDateString()}</p>
                          
                          {borrow.returnDate && (
                            <>
                              <p className="text-gray-600">Return Date:</p>
                              <p>{new Date(borrow.returnDate).toLocaleDateString()}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <BillDetails bill={bill} />

                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Thank you for using our library services!</p>
                    <p>Receipt generated on: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillModal; 