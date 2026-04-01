/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow cross-origin requests in dev
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'towczsowaferbwesarri.supabase.co' },
    ],
  },
}

export default nextConfig
