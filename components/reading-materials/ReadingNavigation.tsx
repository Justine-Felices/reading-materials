import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ReadingNavigationProps {
  href?: string;
  label?: string;
}

export default function ReadingNavigation({
  href = "/reading-materials",
  label = "Back to Reading Materials",
}: ReadingNavigationProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
