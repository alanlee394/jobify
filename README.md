# Jobify - Job Tracker Website

[** Click Me to Visit Live Deployment**](https://jobify-j4fl.vercel.app/)

A modern job search management tool built with **Next.js** and **Prisma** that helps you organize your applications, track interviews, and get AI-powered career advice.

## Features

- **Kanban Board Dashboard**: Organize jobs by status (Applied, Interview, Offer, Rejected)
- **Job Tracking**: Track company, position, status, and notes for each application
- **AI Career Coach**: Get personalized interview questions and strategic advice using OpenAI
- **User Authentication**: Secure login/signup with NextAuth and bcryptjs
- **PostgreSQL Database**: Reliable data persistence with Prisma ORM
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, PostCSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **AI Integration**: OpenAI API
- **Security**: bcryptjs for password hashing

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- OpenAI API key (for AI features)

## Getting Started - How to Run Locally

### 1. Clone & Install

```bash
cd jobify
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the `jobify/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/jobify
AUTH_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_api_key
```

### 3. Start PostgreSQL

Using Docker Compose:

```bash
docker-compose up -d
```

### 4. Setup Database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
jobify/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (NextAuth)
│   ├── dashboard/         # Dashboard pages
│   │   ├── [id]/         # Job detail page
│   │   ├── coach/        # AI coaching page
│   │   └── new/          # Create job page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── lib/
│   ├── actions.ts        # Server actions (CRUD, AI)
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Key Components

### Authentication

- Credentials-based login with bcryptjs password hashing
- JWT session strategy with NextAuth
- Protected dashboard routes

### Database Schema

- **User**: Email, hashed password, created timestamp
- **Job**: Company, position, status, description, user relationship

### Server Actions

- `signup()`: Create new user account
- `createJob()`: Add job to tracking
- `updateJob()`: Modify job details
- `deleteJob()`: Remove job from tracking
- `generateGlobalAdvice()`: AI analysis of entire job search
- `generateJobSpecificAdvice()`: AI tips for specific role

## AI Features

### Career Coach

Get strategic analysis of your entire job search funnel:

- Conversion rate analysis
- Bottleneck identification
- Weekly goals and recommendations

### Role-Specific Advice

For each job, receive:

- Interview questions specific to the role
- Resume keywords
- Tactical tips to stand out

## Security Notes

- Passwords are hashed with bcryptjs
- User ownership is verified on all job operations
- Authentication required for dashboard and actions
- Environment variables for sensitive keys

## Docker Setup

The project includes Docker Compose for PostgreSQL:

```bash
docker-compose up -d      # Start database
docker-compose down       # Stop database
```

## Deployment

This project is ready for deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## License

MIT License - feel free to use this project for personal or commercial purposes.


---

Built with ❤️ using Next.js and Prisma
