import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: String,
  location: String,
  social: {
    github: String,
    linkedin: String,
  },
  resumeLink: String,
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
