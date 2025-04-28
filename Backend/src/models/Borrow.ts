import mongoose, { Schema, Document } from 'mongoose';
  
export interface IBorrow extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  borrowDate: Date;
  borrowedTill: Date;
  returnDate?: Date;
  paymentStatus: 'pending' | 'paid';
  bill?: {
    amount: number;
    lateFee: number;
    totalAmount: number;
    generatedDate: Date;
  };
}

const BorrowSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    borrowDate: {
      type: Date,
      default: Date.now
    },
    borrowedTill: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    bill: {
      amount: Number,
      lateFee: Number,
      totalAmount: Number,
      generatedDate: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IBorrow>('Borrow', BorrowSchema);
