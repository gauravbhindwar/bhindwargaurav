import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function POST(request) {
  // Completely disable web-based admin setup for security
  return NextResponse.json(
    { 
      error: 'Web-based admin setup is disabled for security reasons. Use "npm run create-admin" instead.' 
    },
    { status: 403 }
  );
}

// Get admin setup status
export async function GET() {
  try {
    await connectToDatabase()
    
    const adminCount = await Admin.countDocuments()
    
    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminCount
    })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
