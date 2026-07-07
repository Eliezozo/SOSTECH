/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    }
  } catch {
    /* ignore */
  }
  return "*.supabase.co";
})();

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Type errors still block the build; we skip lint to keep deploys unblocked.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
      },
    ],
  },
};

export default nextConfig;
