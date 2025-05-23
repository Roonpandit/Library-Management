import React, { useRef, useEffect } from "react";
import type { Bill, Borrow, Book, User } from "../types";
import BillDetails from "./BillDetails";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill;
  borrow?: Borrow;
  book?: Book;
  user?: User;
}

const BillModal: React.FC<BillModalProps> = ({
  isOpen,
  onClose,
  bill,

  borrow,
  book,
  user,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      console.log("BillModal - Book:", book);
      console.log("BillModal - Bill:", bill);
    }
  }, [isOpen, book, bill]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;

    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          margin: 0;
          size: auto;
        }
        body {
          margin: 1cm;
        }
        html, body {
          height: 100%;
          overflow: hidden;
        }
        /* Hide browser header and footer */
        head, title, style, script, header, footer, nav {
          display: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    document.body.innerHTML = printContent.innerHTML;

    window.print();

    document.head.removeChild(style);
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleSavePDF = () => {
    const element = printRef.current;
    if (!element) return;

    const options = {
      margin: [10, 10, 10, 10],
      filename: `BookNest_Receipt_${
        new Date().toISOString().split("T")[0]
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as "portrait",
      },
    };

    html2pdf().from(element).set(options).save();
  };

  const isbn = book?.ISBN || bill.bookISBN;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-[10px] shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 ">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Bill Receipt
                </h3>

                <div ref={printRef} className="p-4 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span
                      className="ml-2 text-xl font-bold text-gray-900"
                      style={{ fontFamily: "Times New Roman, Times, serif" }}
                    >
                      BookNest
                    </span>
                  </div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">
                      Library Management System
                    </h2>
                    <p className="text-sm text-gray-600">Book Rental Receipt</p>
                  </div>
                  {(book || borrow || user || isbn) && (
                    <div className="mb-6 text-sm">
                      {book && (
                        <div className="mb-2">
                          <p className="font-medium">Book: {book.title}</p>
                          <p className="text-gray-600">Author: {book.author}</p>
                          {isbn && (
                            <p className="text-gray-600">ISBN: {isbn}</p>
                          )}
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
                          <p>
                            {new Date(borrow.borrowDate).toLocaleDateString()}
                          </p>

                          <p className="text-gray-600">Due Date:</p>
                          <p>
                            {new Date(borrow.borrowedTill).toLocaleDateString()}
                          </p>

                          {borrow.returnDate && (
                            <>
                              <p className="text-gray-600">Return Date:</p>
                              <p>
                                {new Date(
                                  borrow.returnDate
                                ).toLocaleDateString()}
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <BillDetails bill={bill} />
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Thank you for using our library services!</p>
                    <p>Printed on: {new Date().toLocaleString()}</p>
                    <p className="mt-2">
                      Visit again:
                      <Link
                        to="https://library-management-six-livid.vercel.app/"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        https://library-management-six-livid.vercel.app/
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 p-5 bg-gray-50 rounded-b-lg border-t border-gray-200 sm:flex-row-reverse sm:justify-center sm:py-4 sm:px-6">
            <button
              type="button"
              onClick={handleSavePDF}
              className="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-white bg-green-600 border border-transparent rounded-[10px] shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Save as PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-[10px] shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-full px-2 py-15 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[10px] shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:w-auto"
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
