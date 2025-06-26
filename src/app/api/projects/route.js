import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all projects and sort by order field (ascending), then by id as secondary sort
    const projects = await Project.find({})
      .sort({ order: 1, id: 1, createdAt: -1 }) // Sort by order, then id, then creation date
      .lean();
    
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
      
      // Set cache headers
      const response = NextResponse.json({ projects: sortedProjects });
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      return response;
    }
    
    // Return data with cache headers
    const response = NextResponse.json({ projects });
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
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
      return NextResponse.json({ projects: sortedProjects });
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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

    const project = await Project.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Project updated successfully', 
      project 
    });

  } catch (error) {
    console.error('Error updating project:', error);
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
