import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="text-6xl font-bold text-gold">404</p>
      <h1 className="mt-4 text-2xl text-content">Page not found</h1>
      <p className="mt-2 max-w-md text-content-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/en" className="btn-primary mt-8">
        Go to homepage
      </Link>
    </div>
  );
}
