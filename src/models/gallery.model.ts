import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description: string;
  category: string;
  src: string;
  alt?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['office', 'team', 'client', 'services', 'events', 'awards'],
    lowercase: true
  },
  src: {
    type: String,
    required: [true, 'Image source is required'],
    trim: true
  },
  alt: {
    type: String,
    trim: true,
    default: function() {
      return this.title;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
gallerySchema.index({ category: 1, isActive: 1 });
gallerySchema.index({ createdAt: -1 });

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);