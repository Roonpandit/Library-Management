import mongoose, { Schema, Document } from 'mongoose';
  
export interface IBook extends Document {
  title: string;
  author: string;
  ISBN: string;
  publishedDate: Date;
  genre: string;
  copiesAvailable: number;
  chargePerDay: number;
  description?: string;
  imageUrl?: string;
}

const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title']
    },
    author: {
      type: String,
      required: [true, 'Please add an author']
    },
    ISBN: {
      type: String,
      required: [true, 'Please add an ISBN'],
      match: [
        /^(?:\d{10}|\d{13})$/,
        'ISBN must be either 10 or 13 digits'
      ],
      unique: true
    },
    publishedDate: {
      type: Date,
      required: [true, 'Please add a published date']
    },
    genre: {
      type: String,
      required: [true, 'Please add a genre']
    },
    copiesAvailable: {
      type: Number,
      required: [true, 'Please add the number of copies available'],
      min: [0, 'Copies available cannot be negative']
    },
    chargePerDay: {
      type: Number,
      required: [true, 'Please add charge per day'],
      min: [0, 'Charge per day cannot be negative']
    },
    description: {
      type: String
    },
    imageUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IBook>('Book', BookSchema);