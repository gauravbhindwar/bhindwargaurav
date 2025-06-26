// Run with: node scripts/seed-db.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not defined.');
  console.error('Make sure you have a .env.local file with MONGODB_URI defined.');
  process.exit(1);
}

console.log('Connecting to MongoDB...');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Define models
const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
  description: String,
  image: String,
  tech: [String],
  github: String,
  live: String,
  preview: Boolean,
  features: [String],
  order: {
    type: Number,
    default: 999
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update the skill schema to include the new category structure
const skillSchema = new mongoose.Schema({
  name: String,
  icon: String,
  color: String,
  category: {
    type: String,
    required: true,
    enum: ['Languages', 'Web Development', 'Data Science & ML', 'Tools & Platforms']
  }
});

const courseSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ['current', 'completed'],
    required: true
  }
});

const certificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: String,
  description: String,
  credentialLink: String,
  pdfFile: String,
  skills: [String],
  order: {
    type: Number,
    default: 999
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const contactSchema = new mongoose.Schema({
  email: String,
  phone: String,
  location: String,
  social: {
    github: String,
    linkedin: String
  },
  resumeLink: String
});

const Project = mongoose.model('Project', projectSchema);
const Skill = mongoose.model('Skill', skillSchema);
const Course = mongoose.model('Course', courseSchema);
const Certification = mongoose.model('Certification', certificationSchema);
const Contact = mongoose.model('Contact', contactSchema);

// Import JSON data
const importData = async () => {
  try {
    console.log('Reading JSON data files...');
    
    // Read JSON files safely with error handling
    const skillsPath = path.join(__dirname, '../src/data/skills.json');
    const projectsPath = path.join(__dirname, '../src/data/projects.json');
    const contactPath = path.join(__dirname, '../src/data/contact.json');
    const certificationsPath = path.join(__dirname, '../src/data/certifications.json');
    
    // Check if files exist before reading
    if (!fs.existsSync(skillsPath)) {
      throw new Error(`File not found: ${skillsPath}`);
    }
    if (!fs.existsSync(projectsPath)) {
      throw new Error(`File not found: ${projectsPath}`);
    }
    if (!fs.existsSync(contactPath)) {
      throw new Error(`File not found: ${contactPath}`);
    }
    if (!fs.existsSync(certificationsPath)) {
      throw new Error(`File not found: ${certificationsPath}`);
    }
    
    const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    const contactData = JSON.parse(fs.readFileSync(contactPath, 'utf8'));
    const certificationsData = JSON.parse(fs.readFileSync(certificationsPath, 'utf8'));

    console.log('Clearing existing data...');
    
    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Course.deleteMany({});
    await Certification.deleteMany({});
    await Contact.deleteMany({});

    console.log('Inserting new data...');
    
    // Process projects - detect and resolve duplicate orders
    const projectOrderMap = new Map(); // To track used order values
    const projectsToCreate = [];
    
    for (const project of projectsData.projects) {
      // Create a copy to avoid modifying the original data
      const projectCopy = { ...project };
      
      // If order is not defined or is a duplicate, find a new order
      if (!projectCopy.order || projectOrderMap.has(projectCopy.order)) {
        // Find the next available order number
        let order = 1;
        while (projectOrderMap.has(order)) {
          order++;
        }
        projectCopy.order = order;
      }
      
      // Mark this order as used
      projectOrderMap.set(projectCopy.order, true);
      projectsToCreate.push(projectCopy);
    }
    
    // Insert projects with unique orders
    const projectPromises = projectsToCreate.map(project => {
      return Project.create(project);
    });
    await Promise.all(projectPromises);
    console.log(`${projectsToCreate.length} projects imported.`);
    
    // Process skills - convert categories as needed
    const skillPromises = [];
    for (const category of skillsData.categories) {
      // Map old categories to new structure
      let mappedCategory = category.name;
      
      // If using static file with already updated categories, no mapping needed
      // This is just a safeguard for any old data structure
      if (category.name === 'Frontend' || category.name === 'Backend') {
        mappedCategory = 'Web Development';
      }
      
      for (const skill of category.skills) {
        skillPromises.push(Skill.create({
          ...skill,
          category: mappedCategory
        }));
      }
    }
    await Promise.all(skillPromises);
    
    // Insert courses as individual documents
    const coursePromises = [];
    for (const [type, courses] of Object.entries(skillsData.courses)) {
      for (const course of courses) {
        coursePromises.push(Course.create({
          name: course,
          type: type
        }));
      }
    }
    await Promise.all(coursePromises);
    console.log(`${skillPromises.length} skills and ${coursePromises.length} courses imported.`);
    
    // Process certifications - detect and resolve duplicate orders
    const certOrderMap = new Map(); // To track used order values
    const certsToCreate = [];
    
    for (const cert of certificationsData.certifications) {
      // Create a copy to avoid modifying the original data
      const certCopy = { ...cert };
      
      // If order is not defined or is a duplicate, find a new order
      if (!certCopy.order || certOrderMap.has(certCopy.order)) {
        // Find the next available order number
        let order = 1;
        while (certOrderMap.has(order)) {
          order++;
        }
        certCopy.order = order;
      }
      
      // Mark this order as used
      certOrderMap.set(certCopy.order, true);
      certsToCreate.push(certCopy);
    }
    
    // Insert certifications with unique orders
    const certificationPromises = certsToCreate.map(cert => {
      return Certification.create(cert);
    });
    await Promise.all(certificationPromises);
    console.log(`${certsToCreate.length} certifications imported.`);
    
    // Insert contact info
    await Contact.create(contactData);
    console.log('Contact information imported.');

    console.log('Data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Main execution
const seedDB = async () => {
  await connectDB();
  await importData();
};

seedDB();
