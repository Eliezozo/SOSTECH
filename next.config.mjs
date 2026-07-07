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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
      },
    ],
  },
  /** Old static HTML URLs → new Next.js routes (bookmarks, Google, etc.) */
  async redirects() {
    return [
      { source: "/index.html", destination: "/en", permanent: true },
      { source: "/services.html", destination: "/en/services", permanent: true },
      { source: "/projects.html", destination: "/en/projects", permanent: true },
      { source: "/about.html", destination: "/en/about", permanent: true },
      { source: "/contact.html", destination: "/en/contact", permanent: true },
      { source: "/admin.html", destination: "/admin", permanent: true },
    ];
  },
};

export default nextConfig;
