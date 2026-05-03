import Link from 'next/link';

interface Props {
  title:    string;
  backHref?: string;
  right?:   React.ReactNode;
}

export default function NavBar({ title, backHref, right }: Props) {
  return (
    <nav className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-black/5 safe-top">
      <div className="flex items-center h-14 px-4 max-w-2xl mx-auto gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="text-ink-soft p-1 -ml-1 rounded-lg hover:bg-paper transition-colors"
          >
            ←
          </Link>
        )}
        <h1 className="flex-1 font-serif font-semibold text-base text-ink truncate">
          {title}
        </h1>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </nav>
  );
}
