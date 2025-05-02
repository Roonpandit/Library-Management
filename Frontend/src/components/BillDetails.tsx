import React from "react";
import type { Bill } from "../types";

interface BillDetailsProps {
  bill: Bill;
  isPreview?: boolean;
  onPrint?: () => void;
}

const BillDetails: React.FC<BillDetailsProps> = ({
  bill,
  isPreview = false,
  onPrint,
}) => {
  return (
    <div
      className={`p-4 rounded-[10px] ${
        isPreview ? "bg-gray-50" : "border border-blue-200"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Bill Details</h3>
        {onPrint && (
          <button
            onClick={onPrint}
            className="px-3 py-1 text-sm text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
          >
            Print
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {bill.bookISBN && (
          <>
            <p className="text-gray-500">ISBN:</p>
            <p className="font-medium text-right">{bill.bookISBN}</p>
          </>
        )}

        <p className="text-gray-500">Base Amount:</p>
        <p className="font-medium text-right">${bill.amount.toFixed(2)}</p>

        <p className="text-gray-500">Late Fee:</p>
        <p
          className={`font-medium text-right ${
            bill.lateFee > 0 ? "text-red-600" : ""
          }`}
        >
          ${bill.lateFee.toFixed(2)}
        </p>

        {bill.isLate && (
          <>
            <p className="text-gray-500">Late Status:</p>
            <p className="font-medium text-right text-red-600">Overdue</p>
          </>
        )}

        <div className="col-span-2 border-t border-gray-200 my-2"></div>

        <p className="text-gray-800 font-medium">Total Amount:</p>
        <p className="font-bold text-right">${bill.totalAmount.toFixed(2)}</p>

        {bill.generatedDate && (
          <>
            <p className="text-gray-500">Generated On:</p>
            <p className="font-medium text-right">
              {new Date(bill.generatedDate).toLocaleString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BillDetails;
