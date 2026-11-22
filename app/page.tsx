import { cookies } from 'next/headers'

export const instant = false


export default async function Home() {
  const cookieStore = await cookies()
  const loggedIn = cookieStore.get('loggedIn')?.value === 'true'
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-24 px-6 bg-white dark:bg-black sm:py-32 sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            GM Campaign Manager
          </h1>
          <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A complete             tabletop RPG campaign management tool for Game Masters. Organize your
            campaign world, track NPCs, manage sessions, and keep your
            table in sync.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 sm:grid-cols-2 lg:grid-cols-3 w-full justify-items-center">
          <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">For Game Masters</h2>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 list-disc pl-5">
              <li>Create and manage multiple campaigns</li>
              <li>Track NPCs, quests, and world lore</li>
              <li>Schedule sessions and record session notes</li>
              <li>Manage player rosters and permissions</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Getting Started</h2>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 list-disc pl-5">
              <li>Log in to your account</li>
              <li>Create a new campaign or join one</li>
              <li>Add your characters to the roster</li>
              <li>Start managing your tabletop game</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/campaigns"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            Browse Campaigns
          </a>
          {loggedIn ? null : (
            <a
              href="/login"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-zinc-200 dark:border-zinc-800 px-6 text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 sm:w-auto"
            >
              Log In
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
