import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { corsOptionsResponse, corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsOptionsResponse();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
		console.log(email,password);
    if (!email || !password) {
      const response = NextResponse.json(
        { message: 'Email and password are required' },
				{ status: 400 }
      );
      return corsHeaders(response);
    }
		// console.log("email exists");
    // Fetch user from the database
    //const user = await prisma.user.findUnique({
    //  where: { email },
    //});

		// Testing purposes only - remove this in production
		const user = {
			id: "test",
			name: "Test User",
			email: "test@example.com",
			password: "$2a$10$9wzZqYbKjyfXWUOoLJmQe.8sP7RkHvGnFgVrEhDlBpMxuTtCqNz.",
			role: "admin"
		};

    if (!user) {
      const response = NextResponse.json(
        { message: 'Invalid email' },
        { status: 401 }
      );
      return corsHeaders(response);
    }
		console.log(user.password, password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const response = NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
      return corsHeaders(response);
    }
		

		

    // Generate JWT token
    const token = signToken({ userId: user.id, role: user.role }, 3600);

    // Respond with user data and token
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      expiresIn: 3600, // 1 hour
    });
    
    // Add CORS headers to the response
		// console.log("response");
    return corsHeaders(response);
  } catch (error) {
    console.error('Login error:', error);
    const response = NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
		console.log("Login error");
    return corsHeaders(response);
  }
}



