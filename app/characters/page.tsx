export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Characters</h1>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Add Character
          </a>
        </div>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Manage your tabletop RPG characters. Track stats, inventory, spells,
          and character progression across campaigns.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No characters yet</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Log in to add characters to your roster and track their progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
