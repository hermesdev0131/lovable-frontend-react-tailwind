import React, {createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthState, authService } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
	authState: AuthState;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshToken: () => Promise<void>;
	logoutAndRedirect: () => Promise<void>; // New function that logs out and redirects
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [auth, setAuthState] = useState<AuthState>(authService.getAuthState());
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = authService.subscribe((newState: AuthState) => {
			setAuthState(newState);
		});
	
		return () => unsubscribe(); // cleanup on unmount
	}, []);
	
	// Flag to prevent multiple navigation attempts
	const [isNavigating, setIsNavigating] = useState(false);
	
	// Custom function that logs out and redirects to login page
	const logoutAndRedirect = useCallback(async () => {
		// Prevent multiple navigation attempts
		if (isNavigating) {
			console.log("AuthContext: Navigation already in progress");
			return;
		}
		
		try {
			setIsNavigating(true);
			console.log("AuthContext: Starting logout process");
			
			// First attempt to logout via the auth service
			await authService.logout();
			console.log("AuthContext: Logout successful, redirecting to login");
			
			// Navigate to login page with replacement (prevents going back)
			navigate('/login', { replace: true });
		} catch (error) {
			console.error('AuthContext: Logout error:', error);
			
			// Still try to navigate to login even if logout fails
			navigate('/login', { replace: true });
		} finally {
			// Reset the navigating flag after a delay
			setTimeout(() => {
				setIsNavigating(false);
			}, 500);
		}
	}, [navigate, isNavigating]);
	
	const value: AuthContextType = {
		authState: auth,
		login: authService.login.bind(authService),
		logout: authService.logout.bind(authService),
		refreshToken: authService.refreshToken.bind(authService),
		logoutAndRedirect, // Add the new function to the context
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}