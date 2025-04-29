import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface BorrowedBook {
  bookId: mongoose.Types.ObjectId;
  borrowDate: Date;
  borrowedTill: Date;
  returnDate?: Date;
  paymentStatus?: 'pending' | 'paid';
  bill?: {
    amount: number;
    lateFee: number;
    totalAmount: number;
    isLate: boolean;
    generatedDate: Date;
    bookISBN?: string;
  };
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  borrowedBooks: BorrowedBook[];
  role: 'user' | 'admin';
  isBlocked: boolean;
  notifications: Array<{
    message: string;
    date: Date;
    read: boolean;
  }>;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book'
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
          isLate: Boolean,
          generatedDate: Date,
          bookISBN: String
        }
      }
    ],
    isBlocked: {
      type: Boolean,
      default: false
    },
    notifications: [
      {
        message: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          default: Date.now
        },
        read: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
