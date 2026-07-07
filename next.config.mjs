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
  /**
   * Work around the Next.js 16 build-trace bug that drops
   * `@swc/helpers/esm/*` from Vercel lambdas (cause of
   * MIDDLEWARE/FUNCTION_INVOCATION_FAILED). Force-include those files.
   */
  outputFileTracingIncludes: {
    "*": ["./node_modules/@swc/helpers/esm/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
      },
    ],
  },
  async redirects() {
    return [
      /** Old static HTML URLs → new Next.js routes (bookmarks, Google, etc.) */
      { source: "/index.html", destination: "/en", permanent: true },
      { source: "/services.html", destination: "/en/services", permanent: true },
      { source: "/projects.html", destination: "/en/projects", permanent: true },
      { source: "/about.html", destination: "/en/about", permanent: true },
      { source: "/contact.html", destination: "/en/contact", permanent: true },
      { source: "/admin.html", destination: "/admin", permanent: true },
      /** Bare (locale-less) paths → default locale */
      { source: "/services", destination: "/en/services", permanent: false },
      { source: "/projects", destination: "/en/projects", permanent: false },
      { source: "/about", destination: "/en/about", permanent: false },
      { source: "/contact", destination: "/en/contact", permanent: false },
    ];
  },
};

export default nextConfig;
