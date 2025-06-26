import connectToDatabase from '@/lib/mongodb';
import Certification from '@/models/Certification';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all certifications with multiple sort criteria
    const certifications = await Certification.find({})
      .sort({ order: 1, title: 1, createdAt: -1 }) // Sort by order, then alphabetically by title, then by creation date
      .lean();
    
    if (!certifications || certifications.length === 0) {
      // Fallback to static data if no MongoDB data exists
      const staticData = await import('@/data/certifications.json');
      
      // Sort the static data properly handling missing/duplicate orders
      const sortedCertifications = [...staticData.default.certifications].sort((a, b) => {
        // Primary sort: order (if exists)
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;
        
        // If orders are different, use them
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // Secondary sort: title (alphabetically)
        return a.title.localeCompare(b.title);
      });
      
      // Set cache headers
      const response = NextResponse.json({ certifications: sortedCertifications });
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      return response;
    }
    
    // Return data with cache headers
    const response = NextResponse.json({ certifications });
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return response;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    
    // Fallback to static data on error
    try {
      const staticData = await import('@/data/certifications.json');
      const sortedCertifications = [...staticData.default.certifications].sort((a, b) => {
        // Handle missing or duplicate orders with secondary sorts
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;
        
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        return a.title.localeCompare(b.title);
      });
      return NextResponse.json({ certifications: sortedCertifications });
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
    }
  }
}

// Helper function to check admin authentication
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// Create new certification (Admin only)
export async function POST(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificationData = await request.json();
    
    // Validate required fields
    if (!certificationData.title || !certificationData.issuer) {
      return NextResponse.json(
        { error: 'Title and issuer are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const certification = new Certification(certificationData);
    await certification.save();

    return NextResponse.json({ 
      message: 'Certification created successfully', 
      certification 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    );
  }
}

// Update certification (Admin only)
export async function PUT(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const certification = await Certification.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Certification updated successfully', 
      certification 
    });

  } catch (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json(
      { error: 'Failed to update certification' },
      { status: 500 }
    );
  }
}

// Delete certification (Admin only)
export async function DELETE(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const certification = await Certification.findByIdAndDelete(id);

    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Certification deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    );
  }
}
