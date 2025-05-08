# Backend Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- MySQL database

## Environment Setup

1. Create a `.env` file in the backend directory with the following content:

```
FRONTEND_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
JWT_SECRET=contact_pipeline_haven_secret_key_2024
DATABASE_URL="mysql://root:password@localhost:3306/contact_pipeline"
```

Make sure to update the `DATABASE_URL` with your actual MySQL credentials.

## Database Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Create the database and run migrations:

```bash
npx prisma migrate dev --name init
```

4. Seed the database with a test user:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

This will create a test user with the following credentials:
- Email: admin@example.com
- Password: password123
- Role: admin

## Running the Backend

Start the development server:

```bash
npm run dev
```

The backend will be available at http://localhost:3000.

## API Endpoints

### Authentication

- **Login**: `POST /api/auth/login`
  - Request body: `{ email: string, password: string }`
  - Response: `{ user: { id: number, name: string, email: string, role: string }, token: string, expiresIn: number }`

- **Logout**: `POST /api/auth/logout`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ message: string }`

- **Protected Routes**: `GET /api/auth/protected`
  - Headers: `Authorization: Bearer <token>`
  - Used to verify if a user is authenticated

## Troubleshooting

### Prisma Error: "Did not initialize yet"

If you see an error like:
```
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
```

Run the following commands:
```bash
npx prisma generate
```

### Database Connection Issues

If you have issues connecting to the database, make sure:
1. Your MySQL server is running
2. The credentials in the `DATABASE_URL` are correct
3. The database exists (create it manually if needed)

### JWT Secret Issues

If you have issues with JWT authentication, make sure:
1. The `JWT_SECRET` is set in your `.env` file
2. The same secret is used for signing and verifying tokens