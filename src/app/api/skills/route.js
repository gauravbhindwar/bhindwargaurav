import connectToDatabase from '@/lib/mongodb';
import { Skill, Course } from '@/models/Skill';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
      current: courses.filter(course => course.type === 'current').map(course => ({
        _id: course._id,
        name: course.name,
        type: course.type,
        description: course.description || '',
        url: course.url || ''
      })),
      completed: courses.filter(course => course.type === 'completed').map(course => ({
        _id: course._id,
        name: course.name,
        type: course.type,
        description: course.description || '',
        url: course.url || ''
      })),
      paused: courses.filter(course => course.type === 'paused').map(course => ({
        _id: course._id,
        name: course.name,
        type: course.type,
        description: course.description || '',
        url: course.url || ''
      })),
      planned: courses.filter(course => course.type === 'planned').map(course => ({
        _id: course._id,
        name: course.name,
        type: course.type,
        description: course.description || '',
        url: course.url || ''
      }))
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

// Helper function to check admin authentication
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// Create new skill (Admin only)
export async function POST(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, ...skillData } = await request.json();
    
    if (!type || (type !== 'skill' && type !== 'course')) {
      return NextResponse.json(
        { error: 'Type must be either "skill" or "course"' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let newItem;
    if (type === 'skill') {
      if (!skillData.name || !skillData.category) {
        return NextResponse.json(
          { error: 'Name and category are required for skills' },
          { status: 400 }
        );
      }
      newItem = new Skill(skillData);
    } else {
      if (!skillData.name || !skillData.courseType) {
        return NextResponse.json(
          { error: 'Name and course type are required for courses' },
          { status: 400 }
        );
      }
      // Map courseType to type for the Course model
      skillData.type = skillData.courseType;
      delete skillData.courseType;
      newItem = new Course(skillData);
    }

    await newItem.save();

    return NextResponse.json({ 
      message: `${type} created successfully`, 
      [type]: newItem 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating skill/course:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

// Update skill or course (Admin only)
export async function PUT(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id, ...updateData } = await request.json();
    
    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let updatedItem;
    if (type === 'skill') {
      updatedItem = await Skill.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
    } else if (type === 'course') {
      // Map courseType to type for the Course model if present
      if (updateData.courseType) {
        updateData.type = updateData.courseType;
        delete updateData.courseType;
      }
      updatedItem = await Course.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: `${type} updated successfully`, 
      [type]: updatedItem 
    });

  } catch (error) {
    console.error('Error updating skill/course:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// Delete skill or course (Admin only)
export async function DELETE(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let deletedItem;
    if (type === 'skill') {
      deletedItem = await Skill.findByIdAndDelete(id);
    } else if (type === 'course') {
      deletedItem = await Course.findByIdAndDelete(id);
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: `${type} deleted successfully` 
    });

  } catch (error) {
    console.error('Error deleting skill/course:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
