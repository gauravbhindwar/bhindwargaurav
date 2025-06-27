import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true // Add index for faster lookups
  },
  title: {
    type: String,
    required: true,
    index: true // Add index for search functionality
  },
  description: {
    type: String,
    required: true,
  },
  image: String,
  tech: [String],
  github: String,
  live: String,
  preview: Boolean,
  features: [String],
  // Add order field for sorting with default
  order: {
    type: Number,
    default: 999, // Default to a high number for items without order
    index: true  // Add index for faster sorting
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed',
    index: true // Add index for filtering
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound indexes for better query performance
ProjectSchema.index({ order: 1, id: 1 }); // For main sorting
ProjectSchema.index({ status: 1, order: 1 }); // For status filtering + sorting
ProjectSchema.index({ title: 'text', description: 'text' }); // For text search

// Add a pre-save hook to assign order if not provided
ProjectSchema.pre('save', function(next) {
  if (this.isNew && !this.order) {
    // If order is not set, query the highest order and increment
    mongoose.model('Project').findOne({}, {}, { sort: { 'order': -1 } })
      .then(highestProject => {
        this.order = highestProject ? highestProject.order + 1 : 1;
        next();
      })
      .catch(err => {
        console.error('Error setting order for project:', err);
        this.order = 999; // Fallback
        next();
      });
  } else {
    next();
  }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
