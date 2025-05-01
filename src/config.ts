import { redirect } from "next/dist/server/api-utils";

export const config = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
	hubspot: {
		portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '',
		apiKey: process.env.NEXT_PUBLIC_HUBSPOT_API_KEY || '',
		clientId: process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID || '',
		clientSecret: process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET || '',
		redirectUri: process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URI || 'http://localhost:3000/auth/callback',
		scopes: [
			'crm.objects.contact.read',
			'crm.objects.contact.write',
			'crm.objects.deals.read',
			'crm.objects.deals.write'
		]
	},
	n8n: {
		webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
	},
	backend: {
		baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
		hubspotAccessToken: process.env.HUBSPOT_ACCESS_TOKEN || '',
		databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/contact_pipeline',
		databaseSsl: process.env.DATABASE_SSL === 'true',
	},
}