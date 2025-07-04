# Portfolio Website with Admin Dashboard

A modern portfolio website built with Next.js, featuring an admin dashboard for content management.

## Features

### Public Portfolio
- Responsive portfolio website
- Projects showcase
- Skills and certifications display
- Contact form
- Dark/Light theme toggle

### Admin Dashboard
- Secure authentication system
- Project management (CRUD operations)
- Skills and courses management
- Certifications management
- Protected admin routes

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **UI Components**: DaisyUI, Framer Motion
- **Icons**: React Icons

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd gauravkumar
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration  
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Email Configuration (optional)
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 3. Generate NextAuth Secret

```bash
# Generate a random secret
openssl rand -base64 32
```

Or use an online generator and add it to `NEXTAUTH_SECRET`.

### 4. Database Setup

Make sure you have a MongoDB database running. You can use:
- MongoDB Atlas (cloud)
- Local MongoDB installation
- Docker MongoDB container

### 5. Seed the Database (Optional)

```bash
# Seed with sample data
npm run seed

# Create default admin user
npm run seed-admin
```

The default admin credentials will be:
- Username: `admin`
- Password: `admin123`
- Email: `admin@example.com`

**⚠️ Important: Change the default password after first login!**

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Admin Access

### First Time Setup

1. Visit `http://localhost:3000/admin/setup` to create your admin account
2. Or use the seeded admin credentials mentioned above
3. Access the admin dashboard at `http://localhost:3000/admin/dashboard`

### Admin Features

- **Dashboard**: Overview of all content with quick actions
- **Projects**: Add, edit, delete portfolio projects
- **Skills**: Manage technical skills and proficiency levels
- **Certifications**: Manage professional certifications
- **Courses**: Manage completed courses and training

### Admin URLs

- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Projects: `/admin/projects`
- Skills: `/admin/skills`
- Certifications: `/admin/certifications`

## API Endpoints

### Public APIs
- `GET /api/projects` - Fetch all projects
- `GET /api/skills` - Fetch all skills and courses
- `GET /api/certifications` - Fetch all certifications
- `POST /api/contact` - Submit contact form

### Admin APIs (Protected)
- `POST /api/projects` - Create new project
- `PUT /api/projects` - Update project
- `DELETE /api/projects?id={id}` - Delete project
- Similar CRUD operations for skills and certifications

## Security Features

- Protected admin routes with middleware
- JWT-based authentication
- Password hashing with bcrypt
- Session management
- CSRF protection

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
npm run seed-admin   # Create default admin user
```

### Adding New Admin Features

1. Create API routes in `/src/app/api/`
2. Add authentication checks using `getServerSession`
3. Create admin pages in `/src/app/admin/`
4. Update the dashboard navigation

## Deployment

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:

- `MONGODB_URI`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- Other optional variables

### Build and Deploy

```bash
npm run build
npm run start
```

Or deploy to platforms like Vercel, Netlify, or any Node.js hosting service.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGODB_URI` in `.env.local`
   - Ensure your MongoDB instance is running
   - Check network connectivity

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Clear browser cookies/localStorage

3. **Admin Access Denied**
   - Ensure admin user exists in database
   - Check user role is set to 'admin'
   - Try the setup page: `/admin/setup`

### Reset Admin Access

If you're locked out of admin:

1. Run the admin seeding script: `npm run seed-admin`
2. Or manually create an admin user in your MongoDB
3. Or visit `/admin/setup` if no admins exist

## License

This project is private and proprietary.

## Support

For issues or questions, please create an issue in the repository or contact the administrator.
