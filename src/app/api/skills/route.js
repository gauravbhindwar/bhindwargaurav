import connectToDatabase from '@/lib/mongodb';
import { Skill, Course } from '@/models/Skill';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all skills
    const skills = await Skill.find({});
    
    // Fetch all courses
    const courses = await Course.find({});
    
    if (!skills || skills.length === 0) {
      // Fallback to static data if no MongoDB data exists
      const staticData = await import('@/data/skills.json');
      return NextResponse.json(staticData.default);
    }
    
    // Define the category order we want
    const categoryOrder = [
      "Languages", 
      "Web Development", 
      "Data Science & ML", 
      "Tools & Platforms"
    ];
    
    // Restructure data to match the expected format with proper ordering
    let categories = [];
    
    // Group skills by category
    const skillsByCategory = {};
    for (const skill of skills) {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    }
    
    // Build categories array in the specified order
    for (const category of categoryOrder) {
      if (skillsByCategory[category]) {
        categories.push({
          name: category,
          skills: skillsByCategory[category]
        });
      }
    }
    
    // Restructure courses by type
    const coursesByType = {
      current: courses.filter(course => course.type === 'current').map(course => course.name),
      completed: courses.filter(course => course.type === 'completed').map(course => course.name)
    };
    
    // Set cache headers
    const response = NextResponse.json({
      categories,
      courses: coursesByType
    });
    response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    return response;
  } catch (error) {
    console.error('Error fetching skills:', error);
    
    // Fallback to static data on error
    try {
      const staticData = await import('@/data/skills.json');
      return NextResponse.json(staticData.default);
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
  }
}
