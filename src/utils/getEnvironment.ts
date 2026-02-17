export type Environment = 'development' | 'production';

export default function getEnvironment(): Environment {
  // At build time, import.meta.env.DEV is replaced by Astro/Vite
  // In the browser, you can also check VITE_ENVIRONMENT
  const envVar = import.meta.env.VITE_ENVIRONMENT as Environment | undefined;
  
  if (envVar) {
    return envVar;
  }

  // Fallback: check if in development mode
  if (import.meta.env.DEV) {
    return 'development';
  }

  return 'production';
}

export function getAPIUrl(): string {
  return import.meta.env.VITE_API_URL || 'https://example.com';
}

export function isDev(): boolean {
  return getEnvironment() === 'development';
}

export function isProd(): boolean {
  return getEnvironment() === 'production';
}
