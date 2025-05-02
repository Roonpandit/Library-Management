import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Borrow, Book, Bill } from "../types";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import BillModal from "./BillModal";

interface BorrowCardProps {
  borrow: Borrow;
  onReturn?: (borrowId: string) => void;
  onUpdatePayment?: (borrowId: string) => void;
  onGenerateBill?: (borrowId: string, bill: Bill) => void;
}

const BorrowCard: React.FC<BorrowCardProps> = ({
  borrow,
  onReturn,
  onUpdatePayment,
  onGenerateBill,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billState, setBillState] = useState<Bill | null>(borrow.bill || null);
  const [error, setError] = useState<string | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);

  const book =
    typeof borrow.bookId === "string"
      ? null
      : (borrow.bookId as unknown as Book);

  const isOverdue =
    new Date(borrow.borrowedTill) < new Date() && !borrow.returnDate;

  useEffect(() => {
    if (borrow.bill) {
      setBillState(borrow.bill);
    }
  }, [borrow.bill]);

  const handleReturn = async () => {
    if (!onReturn) return;

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.put(`/borrow/${borrow._id}/return`);
      setBillState(data.bill);
      onReturn(borrow._id);
    } catch (error) {
      setError("Failed to return the book");
      console.error("Error returning book:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!onUpdatePayment) return;

    try {
      setLoading(true);
      setError(null);
      await api.put(`/borrow/${borrow._id}/payment`);
      onUpdatePayment(borrow._id);
    } catch (error) {
      setError("Failed to update payment status");
      console.error("Error updating payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    if (!onGenerateBill) return;

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.put(`/borrow/${borrow._id}/bill`, {
        borrowId: borrow._id,
        lateFee: 5,
      });
      setBillState(data.bill);
      onGenerateBill(borrow._id, data.bill);
      setShowBillModal(true);
    } catch (error) {
      setError("Failed to generate bill");
      console.error("Error generating bill:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBill = () => {
    if (billState) {
      setShowBillModal(true);
    } else {
      handleGenerateBill();
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-[10px] border border-blue-200 shadow-sm">
      <div className="p-4">
        {book ? (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="object-cover w-full h-full rounded"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">by {book.author}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-700 bg-gray-100 rounded">
            Book details not available
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-500">Borrowed Date</p>
            <p className="font-medium">
              {new Date(borrow.borrowDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Due Date</p>
            <p className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>
              {new Date(borrow.borrowedTill).toLocaleDateString()}
            </p>
          </div>
          {borrow.returnDate && (
            <>
              <div>
                <p className="text-gray-500">Return Date</p>
                <p className="font-medium">
                  {new Date(borrow.returnDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Status</p>
                <p
                  className={`font-medium ${
                    borrow.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {borrow.paymentStatus === "paid" ? "Paid" : "Pending"}
                </p>
              </div>
            </>
          )}
        </div>

        {billState && (
          <div className="flex justify-between items-center mt-4">
            <div className="p-3 text-sm bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-900">
                Bill: ${billState.totalAmount.toFixed(2)}
              </h4>
            </div>
            <button
              onClick={handleViewBill}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Details
            </button>
            <div className="flex justify-end gap-2 mt-4">
              {user?.role === "admin" &&
                borrow.returnDate &&
                borrow.paymentStatus === "pending" &&
                onUpdatePayment && (
                  <button
                    onClick={handleUpdatePayment}
                    disabled={loading}
                    className="btn btn-success text-sm py-1"
                  >
                    {loading ? "Processing..." : "Mark as Paid"}
                  </button>
                )}

              {user?.role === "admin" &&
                borrow.returnDate &&
                !billState &&
                !borrow.bill &&
                onGenerateBill && (
                  <Link
                    to={`/admin/generate-bill/${borrow._id}`}
                    className="btn btn-secondary text-sm py-1"
                  >
                    Generate Bill
                  </Link>
                )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-2 mt-4 text-sm text-red-800 bg-red-100 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {!borrow.returnDate && onReturn && (
            <button
              onClick={handleReturn}
              disabled={loading}
              className="btn btn-primary text-sm py-1"
            >
              {loading ? "Processing..." : "Return Book"}
            </button>
          )}
        </div>
      </div>

      {(billState || borrow.bill) && (
        <BillModal
          isOpen={showBillModal}
          onClose={() => setShowBillModal(false)}
          bill={billState || borrow.bill!}
          borrow={borrow}
          book={book || undefined}
        />
      )}
    </div>
  );
};

export default BorrowCard;
