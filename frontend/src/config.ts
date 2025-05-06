// Safe access to environment variables for Vite
const getEnv = (key: string, defaultValue: string): string => {
  // For Vite, we use import.meta.env instead of process.env
  return (import.meta.env?.[key] as string) || defaultValue;
};

export const config = {
	apiUrl: getEnv('VITE_API_URL', 'http://localhost:3000/api'),
	//hubspot: {
	//	portalId: getEnv('VITE_HUBSPOT_PORTAL_ID', ''),
	//	apiKey: getEnv('VITE_HUBSPOT_API_KEY', ''),
	//	clientId: getEnv('VITE_HUBSPOT_CLIENT_ID', ''),
	//	clientSecret: getEnv('VITE_HUBSPOT_CLIENT_SECRET', ''),
	//	redirectUri: getEnv('VITE_HUBSPOT_REDIRECT_URI', 'http://localhost:3000/auth/callback'),
	//	scopes: [
	//		'crm.objects.contact.read',
	//		'crm.objects.contact.write',
	//		'crm.objects.deals.read',
	//		'crm.objects.deals.write'
	//	]
	//},
	//n8n: {
	//	webhookUrl: getEnv('VITE_N8N_WEBHOOK_URL', ''),
	//},
	//backend: {
	//	baseUrl: getEnv('VITE_API_BASE_URL', 'http://localhost:3000'),
	//	hubspotAccessToken: getEnv('VITE_HUBSPOT_ACCESS_TOKEN', ''),
	//	databaseUrl: getEnv('VITE_DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/contact_pipeline'),
	//	databaseSsl: getEnv('VITE_DATABASE_SSL', 'false') === 'true',
	//},
}