// Helper to get the correct image URL for property media, supporting local and remote (CDN/external) URLs.
// Usage: getImageUrl(url: string | undefined | null): string

export function getImageUrl(url: string | undefined | null): string {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || '';
  if (!url) {
    // fallback to a default image
    return baseUrl ? `${baseUrl}/_coming_soon.svg` : '/storage/_coming_soon.svg';
  }
  if (url.startsWith('http')) {
    return url;
  }
  // If baseUrl is set, use it as the prefix (no trailing slash)
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  }
  // Default to /storage/ for local
  return `/storage/${url.replace(/^\//, '')}`;
}
