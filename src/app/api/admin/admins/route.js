import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { checkAdminAuth, getAdminSession } from '@/lib/auth'

// GET - Fetch all admins
export async function GET() {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const admins = await Admin.find({}, '-password')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      admins: admins.map(admin => ({
        ...admin,
        _id: admin._id.toString()
      }))
    })
  } catch (error) {
    console.error('Fetch admins error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new admin
export async function POST(request) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { username, email, password, role = 'admin', isActive = true } = body

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new admin
    const newAdmin = new Admin({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      isActive
    })

    await newAdmin.save()

    // Return admin without password
    const adminResponse = await Admin.findById(newAdmin._id, '-password').lean()

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        ...adminResponse,
        _id: adminResponse._id.toString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create admin error:', error)
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return NextResponse.json(
        { error: `Admin with this ${field} already exists` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
