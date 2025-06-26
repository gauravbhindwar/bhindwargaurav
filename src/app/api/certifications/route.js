import connectToDatabase from '@/lib/mongodb';
import Certification from '@/models/Certification';
import { NextResponse } from 'next/server';

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
