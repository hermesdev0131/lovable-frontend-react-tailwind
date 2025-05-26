import axios from 'axios';
import { config } from "@/config";
import { toast } from '@/hooks/use-toast';
import { STORAGE_KEYS } from '@/constants/storageKeys';
//import { PrismaClient } from '@prisma/client';
//import bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';
import { Message } from '../components/chatbot/ChatbotUI';

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
	activities: Array<{
		id: number;
		action: string;
		time: string;
		name: string;
	}>;
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
		activities: [],
	};
	private subscribers: Set<(state: AuthState) => void> = new Set();

	private constructor() {
		this.isLoggingOut = false
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
		const storedRefreshToken = localStorage.getItem('refreshToken');

		// Check if we have the minimum required data
		if (storedUser && storedToken && storedExpiry) {
			try {
				const expiryDate = new Date(storedExpiry);
				
				// Only restore if the token hasn't expired
				if (expiryDate > new Date()) {
					const parsedUser = JSON.parse(storedUser);
					
					// Set the auth state with the stored values
					this.authState = {
						user: parsedUser,
						token: storedToken,
						refreshToken: storedRefreshToken || null,
						expiresAt: expiryDate,
						isAuthenticated: true,
						isLoading: false,
						error: null,
						activities: [],
					};
					
					// console.log("Auth state restored from storage");
					this.notifyListeners();
				} else {
					// console.log("Stored token has expired");
					this.clearAuth();
				}
			} catch (error) {
				// console.error("Error parsing stored auth data:", error);
				this.clearAuth();
			}
		} else {
			// console.log("No complete auth data found in storage");
		}
	}

	private setupSessionCheck() {
		// Check session every minute
		setInterval(() => {
			const expiry = localStorage.getItem('tokenExpiry');
			
			if (expiry && new Date(expiry) <= new Date()) {
				this.clearAuth();
				// console.log("Session expired");
				
				
				toast({
					title: "Session Expired",
					description: "Your session has expired. Please log in again.",
					variant: "destructive",
				});

				window.location.href = '/login';
				// Force redirect to login page
				// window.location.href = '/login';
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

	public async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
		this.authState.isLoading = true;
		this.notifyListeners();

		try {
			// Replace with your actual API endpoint
			const response = await fetch(`${config.apiUrl}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, rememberMe }),
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
				activities: [],
			};
			this.notifyListeners();
			toast({
				title: "Login Failed",
				description: `${error.message}`,
				variant: "destructive",
			});
			throw error;
		}
	}

	private async handleLoginResponse(response: Response): Promise<void> {
		try {
			const data = await response.json();
			
			if (response.ok) {
				// console.log("Login successful!");
				const { user, token, expiresIn, refreshToken } = data;
				const expiryDate = new Date(Date.now() + expiresIn * 1000);

				// Clear any previous auth state first
				this.clearAuth();
				
				// Set the new auth state
				this.authState = {
					user,
					token,
					refreshToken: refreshToken || null,
					expiresAt: expiryDate,
					isAuthenticated: true,
					isLoading: false,
					error: null,
					activities: [],
				};

				// Save to storage and notify listeners
				this.saveToStorage();
				this.notifyListeners();
				
				// Show success toast
				toast({
					title: "Login Successful",
					description: `Welcome back, ${user.name || 'User'}!`,
				});
			} else {
				// console.log("Login failed:", data.message);
				
				// Clear any previous auth state
				this.clearAuth();
				
				// Set error state
				this.authState = {
					...this.authState,
					error: data.message || 'Login failed',
					isLoading: false,
					activities: [],
				};
				
				this.notifyListeners();
				
				// Show error toast
				toast({
					title: "Login Failed",
					description: data.message || 'Login failed',
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error processing login response:", error);
			
			// Clear any previous auth state
			this.clearAuth();
			
			// Set error state
			this.authState = {
				...this.authState,
				error: 'Error processing login response',
				isLoading: false,
				activities: [],
			};
			
			this.notifyListeners();
			
			// Show error toast
			toast({
				title: "Login Failed",
				description: "Error processing login response",
				variant: "destructive",
			});
		}
	}

	// Flag to prevent multiple simultaneous logout calls
	private isLoggingOut = false;

	public async logout(): Promise<void> {
		// Prevent multiple simultaneous logout calls
		if (this.isLoggingOut) {
			// console.log("Logout already in progress, ignoring additional call");
			return;
		}
		
		try {
			this.isLoggingOut = true;
			// console.log("Logout process started");
			// Store tokens before clearing auth state
			const token = this.authState.token;
			const refreshToken = this.authState.refreshToken;
			
			
			
			// Only attempt API call if we have a token
			if (token || refreshToken) {
				try {
					// Set a timeout to ensure the API call doesn't hang indefinitely
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 5000);
					
					// Call logout endpoint with both tokens if available
					const headers: Record<string, string> = {};
					
					if (token) {
						headers['Authorization'] = `Bearer ${token}`;
					}
					
					if (refreshToken) {
						headers['X-Refresh-Token'] = refreshToken;
					}
					
					await fetch(`${config.apiUrl}/auth/logout`, {
						method: 'POST',
						headers,
						signal: controller.signal
					});
					clearTimeout(timeoutId);
					// console.log("Logout API call successful");
				} catch (error) {
					console.error('Logout API error:', error);
					// Continue with logout process even if API call fails
				}
			}
			// First clear the auth state to prevent any further authenticated requests
			
			this.clearAuth();
			// Show toast notification
			toast({
				title: "Logged Out",
				description: "You have been successfully logged out",
			});
			
			// console.log("Logout process completed");
			
			// Note: Navigation to login page is handled in the Navbar component
			// This ensures we have access to the router context for navigation
		} finally {
			// Reset the logging out flag
			this.isLoggingOut = false;
		}
	}

	private clearAuth() {
		// console.log("Clearing auth state----------------------------");
		
		try {
			// First set master mode to false and clear master account data
			localStorage.setItem('master_account_is_master_mode', 'false');
			localStorage.removeItem('master_account_current_client');
			localStorage.removeItem('master_account_is_master_mode');
			
			// Clear all auth-related items
			const authKeys = [
				'user',
				'token',
				'tokenExpiry',
				'refreshToken',
				'hubspot_access_token',
				'hubspot_refresh_token',
				'hubspot_token_expiry',
				'mailchimp_credentials',
				'yextCredentials'
			];
			
			// Clear all application data
			const appKeys = [
				'crm_deals',
				'crm_clients',
				'crm_tasks',
				'crm_team_members',
				'crm_contacts',
				'crm_analytics',
				'crm_settings',
				'crm_preferences'
			];
			
			// Remove all items
			[...authKeys, ...appKeys].forEach(key => {
				try {
					localStorage.removeItem(key);
				} catch (error) {
					console.warn(`Failed to remove ${key} from localStorage:`, error);
				}
			});
			
			// Reset the auth state to initial values
			this.authState = {
				user: null,
				token: null,
				refreshToken: null,
				expiresAt: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
				activities: [],
			};
			
			// Notify all subscribers about the state change
			this.notifyListeners();
			// console.log("Auth state and application data cleared completely");
			
		} catch (error) {
			console.error("Error during clearAuth:", error);
			// Even if there's an error, try to reset the auth state
			this.authState = {
				user: null,
				token: null,
				refreshToken: null,
				expiresAt: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
				activities: [],
			};
			this.notifyListeners();
		}
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
			// Create a new axios instance without the interceptor to avoid infinite loop
			const axiosInstance = axios.create();
			
			const response = await axiosInstance.post<{ 
				token: string; 
				refreshToken: string; 
				expiresIn: number;
				user: {
					id: string;
					name: string;
					email: string;
					role: string;
				}
			}>(
				`${config.apiUrl}/auth/refresh`,
				{ refreshToken: this.authState.refreshToken }
			);

			const { token, refreshToken, expiresIn, user } = response.data;
			
			// Update the auth state with new tokens
			this.authState = {
				...this.authState,
				token: token,
				refreshToken: refreshToken,
				expiresAt: new Date(Date.now() + expiresIn * 1000),
				user: { 
					...user,
					role: (user.role as 'admin' | 'editor' | 'viewer'),
					isEmailVerified: this.authState.user?.isEmailVerified || false }
			};
			
			// Save the updated tokens to storage
			this.saveToStorage();
			
			// Notify listeners of the state change
			this.notifyListeners();
			
			// console.log("Access token refreshed successfully");
		} catch (error) {
			console.error("Failed to refresh access token:", error);
			// If refresh fails, clear tokens and log out
			this.clearAuth();
			this.notifyListeners();
			throw new Error('Session expired. Please log in again.');
		}
	}

	private saveToStorage(): void {
		// Only save if we have valid data
		if (this.authState.user && this.authState.token) {
			localStorage.setItem('user', JSON.stringify(this.authState.user));
			localStorage.setItem('token', this.authState.token);
			localStorage.setItem('tokenExpiry', this.authState.expiresAt?.toISOString() || '');
			
			// Save refresh token if available
			if (this.authState.refreshToken) {
				localStorage.setItem('refreshToken', this.authState.refreshToken);
			}
			
			// console.log("Auth data saved to storage");
		} else {
			console.warn("Attempted to save incomplete auth data to storage");
		}
	}

	public addActivity(activity: { id: number; action: string; time: string; name: string }) {
		const updatedActivities = [activity, ...this.authState.activities];
		this.authState = {
			...this.authState,
			activities: updatedActivities,
		};
		// Save to localStorage
		localStorage.setItem('activities', JSON.stringify(updatedActivities));
		this.notifyListeners();
	}

	public clearActivity(id: number) {
		const updatedActivities = this.authState.activities.filter(activity => activity.id !== id);
		this.authState = {
			...this.authState,
			activities: updatedActivities,
		};
		// Update localStorage
		localStorage.setItem('activities', JSON.stringify(updatedActivities));
		this.notifyListeners();
	}

	public clearAllActivities() {
		this.authState = {
			...this.authState,
			activities: [],
		};
		// Remove from localStorage
		localStorage.removeItem('activities');
		this.notifyListeners();
	}

	public getActivities() {
		// Try to get activities from localStorage first
		const storedActivities = localStorage.getItem('activities');
		if (storedActivities) {
			try {
				const parsedActivities = JSON.parse(storedActivities);
				// Update state if localStorage has activities
				if (parsedActivities.length > 0) {
					this.authState = {
						...this.authState,
						activities: parsedActivities,
					};
				}
			} catch (error) {
				console.error('Error parsing stored activities:', error);
				localStorage.removeItem('activities');
			}
		}
		return this.authState.activities;
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