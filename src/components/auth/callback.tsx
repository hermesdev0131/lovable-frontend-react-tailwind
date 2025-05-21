import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { hubspotAuthService } from '@/services/hubspot_auth';
import { useToast } from '@/hooks/use-toast';

export const AuthCallback = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		const code = searchParams.get('code');
		const error = searchParams.get('error');

		if (error) {
			toast({
				title: "Authentication Error",
				description: `Failed to authenticate with HubSpot: ${error}`,
				variant: "destructive"
			});
			navigate('/login');
			return;
		}

		if (!code) {
			toast({
				title: "Authentication Error",
				description: "No authorization code received",
				variant: "destructive"
			});
			navigate('/login');
			return;
		}

		const handleAuth = async () => {
			try {
				await hubspotAuthService.login(code);
				const user = await hubspotAuthService.getUser();

				toast({
					title: "Success",
					description: `Successfully connected to HubSpot as ${user.email}`
				});

				navigate('/');
			} catch (error) {
				console.error('Authentication error:', error);
				toast({
					title: "Authentication Error",
					description: "Failed to authenticate with Hubspot",
					variant: "destructive"
				});
				navigate('/login');
			}
		};

		handleAuth();
	}, [searchParams, navigate, toast]);

	return (
		<div className="min-h-screen bg-black flex items-center justify-center">
		<div className="text-white text-center">
			<h1 className="text-2xl font-bold mb-4">Connecting to HubSpot...</h1>
			<p className="text-zinc-400">Please wait while we authenticate your account.</p>
		</div>
	</div>
	);
};