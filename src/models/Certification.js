import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  date: String,
  description: String,
  credentialLink: String,
  pdfFile: String,
  skills: [String],
  // Add order field for sorting with default
  order: {
    type: Number,
    default: 999, // Default to a high number for items without order
    index: true  // Add index for faster sorting
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to assign order if not provided
CertificationSchema.pre('save', function(next) {
  if (this.isNew && !this.order) {
    // If order is not set, query the highest order and increment
    mongoose.model('Certification').findOne({}, {}, { sort: { 'order': -1 } })
      .then(highestCert => {
        this.order = highestCert ? highestCert.order + 1 : 1;
        next();
      })
      .catch(err => {
        console.error('Error setting order for certification:', err);
        this.order = 999; // Fallback
        next();
      });
  } else {
    next();
  }
});

export default mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
