import { redirect } from "next/navigation";

/** Fallback when proxy does not run — always send `/` to the default locale. */
export default function RootPage() {
  redirect("/en");
}
