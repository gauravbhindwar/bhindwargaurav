import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectToDatabase();
    const contact = await Contact.findOne({});
    
    if (!contact) {
      // Fallback to static data if no MongoDB data exists
      const staticData = await import('@/data/contact.json');
      return NextResponse.json(staticData.default);
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact information:', error);
    
    // Fallback to static data on error
    try {
      const staticData = await import('@/data/contact.json');
      return NextResponse.json(staticData.default);
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch contact information' }, { status: 500 });
    }
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();
    
    // Create or update contact information (there should only be one)
    const contact = await Contact.findOneAndUpdate(
      {},
      data,
      { upsert: true, new: true, runValidators: true }
    );
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();
    
    // Update existing contact information
    const contact = await Contact.findOneAndUpdate(
      {},
      data,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}
