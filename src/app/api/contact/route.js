import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { NextResponse } from 'next/server';

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
