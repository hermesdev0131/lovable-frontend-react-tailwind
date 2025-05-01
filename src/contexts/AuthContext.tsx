import React, {createContext, useContext, useEffect, useState } from 'react';
import { AuthState, authService } from '@/services/auth';

interface AuthContextType {
	authState: AuthState;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshToken: ()=> Promise<void>;	
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [auth, setAuthState] = useState<AuthState>(authService.getAuthState());

	useEffect(() => {
		const unsubscribe();
	}, []);

	const value = {
		authState,
		login: authService.login,
		logout: authService.logout,
		refreshToken: authService.refreshToken,
	};
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}