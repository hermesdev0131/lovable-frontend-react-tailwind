import { http, HttpResponse } from 'msw';

// Mock user data
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Admin User',
    isEmailVerified: true,
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User',
    isEmailVerified: true,
    role: 'viewer'
  }
];

// Mock authentication handlers
export const handlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create a mock token (in a real app, this would be a JWT)
    const token = `mock-token-${user.id}-${Date.now()}`;
    const expiresIn = 3600; // 1 hour
    
    return HttpResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      },
      token,
      expiresIn
    });
  }),
  
  // Logout endpoint
  http.post('/api/auth/logout', () => {
    return HttpResponse.json(
      { message: 'Logged out successfully' }
    );
  }),
  
  // Refresh token endpoint
  http.post('/api/auth/refresh', async ({ request }) => {
    // In a real app, you would validate the refresh token
    const { refreshToken } = await request.json() as { refreshToken: string };
    
    if (!refreshToken) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    
    // Create a new token
    const token = `mock-token-refresh-${Date.now()}`;
    const expiresIn = 3600; // 1 hour
    
    return HttpResponse.json({
      token,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      expiresIn
    });
  })
];