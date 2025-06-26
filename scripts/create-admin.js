#!/usr/bin/env node

import readline from 'readline';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function hiddenQuestion(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function createAdmin() {
  try {
    console.log('🛡️  Admin Account Setup');
    console.log('========================\n');

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdminCount = await Admin.countDocuments();
    if (existingAdminCount > 0) {
      console.log('⚠️  Admin accounts already exist:');
      const admins = await Admin.find({}, 'username email createdAt').sort({ createdAt: 1 });
      admins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.username} (${admin.email}) - Created: ${admin.createdAt.toLocaleDateString()}`);
      });
      
      const proceed = await question('\n❓ Do you want to create another admin? (y/N): ');
      if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
        console.log('🚫 Admin creation cancelled');
        process.exit(0);
      }
    }

    // Collect admin details
    const username = await question('👤 Enter username: ');
    if (!username || username.trim().length < 3) {
      console.log('❌ Username must be at least 3 characters long');
      process.exit(1);
    }

    const email = await question('📧 Enter email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Please enter a valid email address');
      process.exit(1);
    }

    const password = await hiddenQuestion('🔒 Enter password: ');
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    const confirmPassword = await hiddenQuestion('🔒 Confirm password: ');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      process.exit(1);
    }

    // Check if admin with this username/email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }]
    });

    if (existingAdmin) {
      console.log('❌ Admin with this username or email already exists');
      process.exit(1);
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const admin = new Admin({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('\n✅ Admin account created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt.toLocaleString()}\n`);

    console.log('🌐 You can now log in at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
}

// Run the script
createAdmin();
