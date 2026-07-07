export type Status = { type: "success" | "error" | "info"; message: string } | null;

export const fieldClass =
  "w-full rounded-md border border-white/10 bg-ink-alt/60 px-4 py-2.5 text-sm text-content outline-none transition-colors placeholder:text-content-muted/60 focus:border-gold focus:ring-1 focus:ring-gold";

export function StatusBanner({ status }: { status: Status }) {
  if (!status) return null;
  const styles: Record<NonNullable<Status>["type"], string> = {
    success: "border-green-500/30 bg-green-500/10 text-green-300",
    error: "border-red-500/30 bg-red-500/10 text-red-300",
    info: "border-blue/30 bg-blue/10 text-blue-light",
  };
  return (
    <p className={`mt-4 rounded-md border px-4 py-3 text-sm ${styles[status.type]}`}>
      {status.message}
    </p>
  );
}
