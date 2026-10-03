import Link from 'next/link';

interface Props {
  current: 'journal' | 'bento' | 'classic';
}

export default function NavigationBanner({ current }: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase text-[11px] bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-2 py-0.5 rounded">
            Design Showcase
          </span>
          <span className="text-zinc-500 hidden md:inline">
            Compare our 2 custom UI/UX archetypes in real-time
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 dark:border-zinc-800">
          <Link
            href="/journal"
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              current === 'journal'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            📰 Editorial Journal
          </Link>
          <Link
            href="/bento"
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              current === 'bento'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            🍱 Visual Bento Grid
          </Link>
          <Link
            href="/"
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              current === 'classic'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            ⚡ Classic Feed
          </Link>
        </div>
      </div>
    </nav>
  );
}
