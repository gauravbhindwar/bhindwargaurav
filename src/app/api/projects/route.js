import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';

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
