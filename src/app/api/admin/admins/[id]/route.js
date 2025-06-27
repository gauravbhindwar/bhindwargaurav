import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { checkAdminAuth, getAdminSession } from '@/lib/auth'

// GET - Fetch specific admin
export async function GET(request, { params }) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = params

    await connectToDatabase()

    const admin = await Admin.findById(id, '-password').lean()

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: {
        ...admin,
        _id: admin._id.toString()
      }
    })
  } catch (error) {
    console.error('Fetch admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update admin
export async function PUT(request, { params }) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { username, email, password, role, isActive } = body

    // Get current session to check if user is updating themselves
    const session = await getAdminSession()
    const isUpdatingSelf = session?.user?.id === id

    // Validation
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      )
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (role && !['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if admin exists
    const existingAdmin = await Admin.findById(id)
    if (!existingAdmin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Check for duplicate username/email (excluding current admin)
    const duplicateCheck = await Admin.findOne({
      _id: { $ne: id },
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    })

    if (duplicateCheck) {
      return NextResponse.json(
        { error: 'Admin with this email or username already exists' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData = {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      role: role || existingAdmin.role,
      isActive: isActive !== undefined ? isActive : existingAdmin.isActive
    }

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: '-password' }
    ).lean()

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
      admin: {
        ...updatedAdmin,
        _id: updatedAdmin._id.toString()
      },
      isUpdatingSelf
    })
  } catch (error) {
    console.error('Update admin error:', error)
    
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

// DELETE - Delete admin
export async function DELETE(request, { params }) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = params

    // Get current session to prevent self-deletion
    const session = await getAdminSession()
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if admin exists
    const admin = await Admin.findById(id)
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Check if this is the last admin
    const adminCount = await Admin.countDocuments({ isActive: true })
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last active admin account' },
        { status: 400 }
      )
    }

    // Delete admin
    await Admin.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    })
  } catch (error) {
    console.error('Delete admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
