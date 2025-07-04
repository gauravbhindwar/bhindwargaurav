import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all projects with optimized query - only select needed fields
    const projects = await Project.find({}, {
      id: 1,
      title: 1,
      description: 1,
      image: 1,
      tech: 1,
      github: 1,
      live: 1,
      preview: 1,
      features: 1,
      order: 1,
      status: 1,
      createdAt: 1
    })
      .sort({ order: 1, id: 1, createdAt: -1 }) // Sort by order, then id, then creation date
      .lean() // Use lean() for better performance
      .maxTimeMS(5000); // Set query timeout to 5 seconds
    
    if (!projects || projects.length === 0) {
      // Fallback to static data if no MongoDB data exists
      const staticData = await import('@/data/projects.json');
      
      // Sort the static data by order field with proper secondary sorts
      const sortedProjects = [...staticData.default.projects].sort((a, b) => {
        // Primary sort: order (if exists)
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;
        
        // If orders are different, use them
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // Secondary sort: id
        return a.id.localeCompare(b.id);
      });
      
      // Set cache headers for static data
      const response = NextResponse.json({ projects: sortedProjects });
      response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=1200'); // Cache static data longer
      return response;
    }
    
    // Return data with optimized cache headers
    const response = NextResponse.json({ projects });
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
    response.headers.set('ETag', `"${Date.now()}"`);
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    
    // Fallback to static data on error
    try {
      const staticData = await import('@/data/projects.json');
      const sortedProjects = [...staticData.default.projects].sort((a, b) => {
        // Handle missing or duplicate orders with secondary sorts
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;
        
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        return a.id.localeCompare(b.id);
      });
      
      const response = NextResponse.json({ projects: sortedProjects });
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      return response;
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
  }
}

// Helper function to check admin authentication
async function checkAdminAuth() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return false;
    }
    
    // Check if user has admin or super_admin role
    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Create new project (Admin only)
export async function POST(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.id || !projectData.title || !projectData.description) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, description' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if project with this ID already exists
    const existingProject = await Project.findOne({ id: projectData.id });
    if (existingProject) {
      return NextResponse.json(
        { error: 'Project with this ID already exists' },
        { status: 409 }
      );
    }

    const project = new Project(projectData);
    await project.save();

    return NextResponse.json({ 
      message: 'Project created successfully', 
      project 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// Update project (Admin only)
export async function PUT(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Use findOneAndUpdate with lean option for better performance
    const project = await Project.findOneAndUpdate(
      { id },
      { 
        ...updateData, 
        updatedAt: new Date() 
      },
      { 
        new: true,
        lean: true, // Return plain object instead of mongoose document
        runValidators: true, // Ensure schema validation
        maxTimeMS: 5000 // Set timeout for update operation
      }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Return success response with cache invalidation headers
    const response = NextResponse.json({ 
      message: 'Project updated successfully', 
      project 
    });
    
    // Add headers to invalidate any cached data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('ETag', `"${Date.now()}"`);
    
    return response;

  } catch (error) {
    console.error('Error updating project:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid project data: ' + error.message },
        { status: 400 }
      );
    }
    
    if (error.name === 'MongoTimeoutError') {
      return NextResponse.json(
        { error: 'Database operation timed out. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// Delete project (Admin only)
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
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const project = await Project.findOneAndDelete({ id });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
