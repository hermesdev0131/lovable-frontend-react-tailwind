import axios from 'axios';
import { config } from '@/config';
import { redirect } from 'next/dist/server/api-utils';

export interface HubSpotAuthResponse {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
}

export interface HubSpotUser {
	id: string;
	email: string;
	name: string;
	hub_domain: string;
}

class HubSpotAuthService {
	private static instance: HubSpotAuthService;
	private accessToken: string | null = null;
	private refreshToken: string | null = null;
	private tokenExpiry: number | null = null;

	private constructor() {
		this.loadTokens();
	}

	public static getInstance(): HubSpotAuthService {
		if (!HubSpotAuthService.instance) {
			HubSpotAuthService.instance = new HubSpotAuthService();
		}
		return HubSpotAuthService.instance;
	}

	private loadTokens() {
		this.accessToken = localStorage.getItem('hubspot_access_token');
		this.refreshToken = localStorage.getItem('hubspot_refresh_token');
		const expiry = localStorage.getItem('hubspot_token_expiry');
		this.tokenExpiry = expiry ? parseInt(expiry) : null;
	}

	private saveTokens(accessToken: string, refreshToken: string, expiresIn: number) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.tokenExpiry = Date.now() + (expiresIn * 1000);

		localStorage.setItem('hubspot_access_token', accessToken);
		localStorage.setItem('hupspot_refresh_token', refreshToken);
		localStorage.setItem('hubspot_token_expiry', this.tokenExpiry.toString());
	}

	public clearTokens() {
		this.accessToken = null;
		this.refreshToken = null;
		this.tokenExpiry = null;
		localStorage.removeItem('hubspot_access_token');
		localStorage.removeItem('hubspot_refresh_token');
		localStorage.removeItem('hubspot_token_expiry');
	}

	public async login(code: string): Promise<HubSpotAuthResponse> {
		try {
			const response = await axios.post<HubSpotAuthResponse>(
				'https://api.hubapi.com/oauth/v1/token',
				{
					grant_type: 'authorization_code',
					client_id: config.hubspot.clientId,
					client_secret: config.hubspot.clientSecret,
					redirect_uri: config.hubspot.redirectUri,
					code,
				}
			);

			this.saveTokens(
				response.data.access_token,
				response.data.refresh_token,
				response.data.expires_in
			);

			return response.data;
		} catch (error) {
			console.error('HubSpot login error:', error);
			throw error;
		}
	}

	public async refreshToken_function(): Promise<void> {
		if (!this.refreshToken) {
			throw new Error('No refresh token available');
		}

		try {
			const response = await axios.post<HubSpotAuthResponse>(
				'https://api.hubapi.com/oauth/v1/token',
				{
					grant_type: 'refresh_token',
					client_id: config.hubspot.clientId,
					client_secret: config.hubspot.clientSecret,
					refresh_token: this.refreshToken,
				}
			);

			this.saveTokens(
				response.data.access_token,
				response.data.refresh_token,
				response.data.expires_in
			);
		} catch (error) {
			console.error('HubSpot token refresh error:', error);
			this.clearTokens();
			throw error;
		}
	}

	public async getUser(): Promise<HubSpotUser> {
		if (!this.accessToken) {
			throw new Error('No access token available');
		}

		try {
			const response = await axios.get<HubSpotUser>(
				'https://api.hubapi.com/oauth/v1/access-tokens/' + this.accessToken
			);
			return response.data;
		} catch (error) {
			console.error('Hubspot user fetch error:', error);
			throw error;
		}
	}

	public isAuthenticated(): boolean {
		return !!this.accessToken && !!this.tokenExpiry && this.tokenExpiry > Date.now();
	}

	public getAccessToken(): string | null {
		return this.accessToken;
	}
}

export const hubspotAuthService = HubSpotAuthService.getInstance();
