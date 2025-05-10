import axios from 'axios';
import { config } from "@/config";
import { toast } from '@/hooks/use-toast';
//import { PrismaClient } from '@prisma/client';
//import bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';

interface LoginCredentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		email: string;
		name: string;
		isEmailVerified: boolean;
	};
}

interface User {
	id: string;
	email: string;
	name: string;
	isEmailVerified: boolean;
	role: 'admin' | 'editor' | 'viewer';
	lastLogin?: string;
}

interface Session {
	id: string;
	deviceInfo: string;
	lastActive: string;
	createdAt: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	refreshToken: string | null;
	expiresAt: Date | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

//const prisma = new PrismaClient();

export class AuthService {
	private static instance: AuthService;
	private authState: AuthState = {
		user: null,
		token: null,
		refreshToken: null,
		expiresAt: null,
		isAuthenticated: false,
		isLoading: false,
		error: null,
	};
	private subscribers: Set<(state: AuthState) => void> = new Set();

	private constructor() {
		this.initializeFromStorage();
		this.setupSessionCheck();
	}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	private initializeFromStorage() {
		const storedUser = localStorage.getItem('user');
		const storedToken = localStorage.getItem('token');
		const storedExpiry = localStorage.getItem('tokenExpiry');

		if (storedUser && storedToken && storedExpiry) {
			const expiryDate = new Date(storedExpiry);
			if (expiryDate > new Date()) {
				this.authState = {
					user: JSON.parse(storedUser),
					token: storedToken,
					refreshToken: null,
					expiresAt: expiryDate,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				};
				this.notifyListeners();
			} else {
				this.clearAuth();
			}
		}
	}

	private setupSessionCheck() {
		// Check session every minute
		setInterval(() => {
			const expiry = localStorage.getItem('tokenExpiry');
			if (expiry && new Date(expiry) <= new Date()) {
				this.clearAuth();
				toast({
					title: "Session Expired",
					description: "Your session has expired. Please log in again.",
					variant: "destructive",
				});
			}
		}, 60000);
	}

	public subscribe(listener: (state: AuthState) => void) {
		this.subscribers.add(listener);
		// Immediately notify new subscriber of current state
		listener(this.authState);
		return () => {
			this.subscribers.delete(listener);
		}
	}

	private notifyListeners() {
		this.subscribers.forEach(listener => listener(this.authState));
	}

	public getAuthState(): AuthState {
		return this.authState;
	}

	public async login(email: string, password: string): Promise<void> {
		this.authState.isLoading = true;
		this.notifyListeners();

		try {
			// Replace with your actual API endpoint
			const response = await fetch(`${config.apiUrl}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			await this.handleLoginResponse(response);
			
		} catch (error) {
			this.authState = {
				user: null,
				token: null,
				refreshToken: null,
				expiresAt: null,
				isAuthenticated: false,
				isLoading: false,
				error: error instanceof Error ? error.message : 'Login failed',
			};
			this.notifyListeners();
			toast({
				title: "Login Failed",
				description: "Invalid email or password",
				variant: "destructive",
			});
			throw error;
		}
	}

	private async handleLoginResponse(response: Response): Promise<void> {
		const data = await response.json();
		console.log(data);
		if (response.ok) {
			console.log("login success!");
			const { user, token, expiresIn } = data;
			const expiryDate = new Date(Date.now() + expiresIn * 1000);

			this.authState = {
				user,
				token,
				refreshToken: null,
				expiresAt: expiryDate,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};

			this.saveToStorage();
			this.notifyListeners();
			toast({
				title: "Login Successful",
				description: `Welcome back, ${user.name}!`,
			});
		} else {
			console.log("login fail");
			this.authState = {
				user: null,
				token: null,
				refreshToken: null,
				expiresAt: null,
				isAuthenticated: false,
				isLoading: false,
				error: data.message || 'Login failed',
			};
			this.notifyListeners();
			toast({
				title: "Login Failed",
				description: data.message || 'Login failed',
				variant: "destructive",
			});
		}
	}

	public async logout(): Promise<void> {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				// Call logout endpoint if needed
				await fetch(`${config.apiUrl}/auth/logout`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
			} catch (error) {
				console.error('Logout error:', error);
			// } finally {
			// 	this.clearAuth();
			// 	console.log("Auth data cleared");
			// 	toast({
			// 		title: "Logged Out",
			// 		description: "You have been successfully logged out",
			// 	});
			}
		}

		this.clearAuth();
		console.log("Auth data cleared");
		toast({
			title: "Logged Out",
			description: "You have been successfully logged out",
		});
		
	}

	private clearAuth() {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		localStorage.removeItem('tokenExpiry');
		this.authState = {
			user: null,
			token: null,
			refreshToken: null,
			expiresAt: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
		};
		this.notifyListeners();
	}

	public async refreshToken(): Promise<void> {
		if (!this.authState.refreshToken) {
			throw new Error('No refresh token available');
		}

		try {
			const response = await fetch(`${config.apiUrl}/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken: this.authState.refreshToken}),
			});

			if (!response.ok) {
				throw new Error('Token refresh failed');
			}

			const data = await response.json();
			this.authState = {
				...this.authState,
				token: data.token,
				refreshToken: data.refreshToken,
				expiresAt: new Date(Date.now() + data.expiresIn * 1000),
			};
		} catch (error) {
			console.error('Token refresh error:', error);
			this.clearAuth();
			throw error;
		}
	}

	public async requestPasswordReset(email: string): Promise<void> {
		try {
			await axios.post(`${config.apiUrl}/auth/password-reset/request`, { email });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || 'Failed to request password reset');
			}
			throw error;
		}
	}

	public async resetPassword(token: string, newPassword: string): Promise<void> {
		try {
			await axios.post(`${config.apiUrl}/auth/password-reset/confirm`, {
				token,
				newPassword
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || 'Failed to reset password');
			}
			throw error;
		}
	}

	public async verifyEmail(token: string): Promise<void> {
		try {
			await axios.post(`${config.apiUrl}/auth/verify-email`, { token });
			
			// Updates user verification status
			const user = this.getCurrentUser();
			if (user) {
				user.isEmailVerified = true;
				localStorage.setItem('user', JSON.stringify(user));
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || 'Failed to verify email');
			}
			throw error;
		}
	}

	public async resendVerificationEmail(): Promise<void> {
		try {
			await axios.post(`${config.apiUrl}/auth/verify-email/resend`);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || 'Failed to resend verification email');
			}
			throw error;
		}
	}

	public async getActiveSessions(): Promise<Session[]> {
		try {
			const response = await axios.get<Session[]>(`${config.apiUrl}/auth/sessions`);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || 'Failed to get active sessions');
			}
			throw error;
		}
	}

	public async revokeSession(sessionId: string): Promise<void> {
		try {
			await axios.delete(`${config.apiUrl}/auth/sessions/${sessionId}`);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || 'Failed to revoke session');
			}
			throw error;
		}
	}

	public isAuthenticated(): boolean {
		return !!this.authState.token;
	}

	public getAccessToken(): string | null {
		return this.authState.token;
	}

	public getCurrentUser(): User | null {
		const userStr = localStorage.getItem('user');
		return userStr ? JSON.parse(userStr) : null;
	}

	public async refreshAccessToken(): Promise<void> {
		if (!this.authState.refreshToken) {
			throw new Error('No refresh token available');
		}

		try {
			const response = await axios.post<{ accessToken: string; refreshToken: string; expiresIn: number}> (
				`${config.apiUrl}/auth/refresh`,
				{ refreshToken: this.authState.refreshToken }
			);

			const { accessToken, refreshToken } = response.data;
			this.authState = {
				...this.authState,
				token: accessToken,
				refreshToken: refreshToken,
				expiresAt: new Date(Date.now() + response.data.expiresIn * 1000),
			};
		} catch (error) {
		 // If refresh fails, clear tokens and log out
		 this.logout();
		 throw new Error('Session expired. Please log in again.');
	 }
 }

 private saveToStorage(): void {
	 localStorage.setItem('user', JSON.stringify(this.authState.user));
	 localStorage.setItem('token', this.authState.token ?? '');
	 localStorage.setItem('tokenExpiry', this.authState.expiresAt?.toISOString() || '');
 }
}

export const authService = AuthService.getInstance();

// export const useAuth = () => {
//  return {
// 	 login: authService.login.bind(authService),
// 	 logout: authService.logout.bind(authService),
// 	 isAuthenticated: authService.isAuthenticated.bind(authService),
// 	 getAccessToken: authService.getAccessToken.bind(authService),
//  };
// }