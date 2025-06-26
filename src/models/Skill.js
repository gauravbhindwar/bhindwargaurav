import mongoose from 'mongoose';

// Individual skill schema
const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: String,
  color: String,
  category: {
    type: String,
    required: true,
    // Update enum to include the new category structures
    enum: ['Languages', 'Web Development', 'Data Science & ML', 'Tools & Platforms']
  }
});

// Separate schema for courses
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Keep type for backward compatibility but make it required
  type: {
    type: String,
    enum: ['current', 'completed', 'paused', 'planned'],
    required: true,
    default: 'current'
  },
  description: String,
  url: String
});

// Export both models
const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export { Skill, Course };
