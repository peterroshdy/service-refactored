import { Document, Schema, model } from 'mongoose';

interface IPrice {
  weekend: number;
  weekdays: number;
  fullweek: number;
  month?: number;
  year?: number;
  specialPackages: string[];
}

interface IPlace extends Document {
  name: string;
  description: string;
  price: IPrice;
  specifications: Record<string, any>;
  mapsLink: string;
  currency: string;
  city: string;
  availability: boolean;
  adminAllowed: boolean;
  placeDirectBooking: boolean;
  placeAllowedBooking: number[];
  placeRow: number;
  insuranceAmount: number;
  images: string[];
  categoryId: string;
  placeType: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const placeSchema = new Schema<IPlace>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    weekend: {
      type: Number,
      required: true,
      default: 0,
    },
    weekdays: {
      type: Number,
      required: true,
      default: 0,
    },
    fullweek: {
      type: Number,
      required: true,
      default: 0,
    },
    month: {
      type: Number,
      required: false,
      default: 0,
    },
    year: {
      type: Number,
      required: false,
      default: 0,
    },
    specialPackages: {
      type: [String],
      default: [],
    },
  },
  specifications: {
    type: Schema.Types.Mixed, // Store as JSON
    required: true,
  },
  mapsLink: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    default: 'KWD',
  },
  city: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  adminAllowed: {
    type: Boolean,
    default: false,
  },
  placeDirectBooking: {
    type: Boolean,
    default: false,
  },
  placeAllowedBooking: {
    type: [Number],
    default: [1],
  },
  placeRow: {
    type: Number,
    default: 0,
  },
  insuranceAmount: {
    type: Number,
    default: 0,
  },
  images: [{
    type: String,
  }],
  placeType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Place = model<IPlace>('Place', placeSchema);

export default Place;