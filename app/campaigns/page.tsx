'use client'

import { useState, useEffect } from 'react'
import { createCampaign, getCampaigns, createEncounter, createNpc, createNote, getEncounters, getNpcs, getNotes } from '../actions'

export default function CampaignsPage() {
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [campaigns, setCampaigns] = useState<{ id: string; title: string; description: string }[]>([])
  const [selected, setSelected] = useState<{ id: string; title: string; description: string } | null>(null)
  const [selectedEncounter, setSelectedEncounter] = useState<{ id: string; name: string; description: string } | null>(null)
  const [selectedNpc, setSelectedNpc] = useState<{ id: string; name: string; description: string } | null>(null)
  const [selectedNote, setSelectedNote] = useState<{ id: string; name: string; description: string } | null>(null)
  const [encounters, setEncounters] = useState<{ id: string; name: string; description: string }[]>([])
  const [npcs, setNpcs] = useState<{ id: string; name: string; description: string }[]>([])
  const [notes, setNotes] = useState<{ id: string; name: string; description: string }[]>([])
  const [toast, setToast] = useState('')
  const [dice, setDice] = useState(20)
  const [count, setCount] = useState(1)
  const [mod, setMod] = useState(0)
  const [rolls, setRolls] = useState<number[]>([])
  const [result, setResult] = useState<number | null>(null)
  const [rolledMod, setRolledMod] = useState(0)
  const [subForm, setSubForm] = useState<'encounter' | 'npc' | 'note' | null>(null)
  const [subName, setSubName] = useState('')
  const [subDesc, setSubDesc] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const result = await getCampaigns()
      if (result.ok) setCampaigns(result.data)
    })()
  }, [])

  useEffect(() => {
    if (!selected) return
    (async () => {
      const e = await getEncounters(selected.id)
      const n = await getNpcs(selected.id)
      const s = await getNotes(selected.id)
      if (e.ok) setEncounters(e.data)
      if (n.ok) setNpcs(n.data)
      if (s.ok) setNotes(s.data)
    })()
  }, [selected])

  async function handleDone(e: React.FormEvent) {
    e.preventDefault()
    if (!title) { setError('Title is required.'); return }
    setLoading(true)
    const result = await createCampaign(title, description)
    setLoading(false)
    if (!result.ok) { setError(result.message); return }
    setShow(false)
    setTitle('')
    setDescription('')
    setError('')
    setToast(`Campaign "${title}" created`)
    setTimeout(() => setToast(''), 12000)
    const result2 = await getCampaigns()
    if (result2.ok) setCampaigns(result2.data)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Campaigns</h1>
          <button
            onClick={() => setShow(!show)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Create Campaign
          </button>
        </div>

        {show && (
          <form onSubmit={handleDone} className="mb-8 space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 rounded-lg border" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium">
              {loading ? 'Saving...' : 'Create'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {campaigns.length === 0 ? (
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No campaigns yet</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Create your first campaign to start managing your tabletop game.
              </p>
            </div>
          ) : (
            campaigns.map((c) => (
              <div key={c.id} onClick={() => setSelected(c)} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{c.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{c.description}</p>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-2">{selected.title}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{selected.description}</p>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setMenuOpen(!menuOpen)} className="px-3 py-1 rounded bg-zinc-900 text-white text-sm">☰</button>
                {menuOpen && (
                  <>
                    <button onClick={() => { setSubForm(subForm === 'encounter' ? null : 'encounter'); setMenuOpen(false) }} className="px-3 py-1 rounded bg-zinc-900 text-white text-sm border-2 border-purple-500">Make an Encounter</button>
                    <button onClick={() => { setSubForm(subForm === 'npc' ? null : 'npc'); setMenuOpen(false) }} className="px-3 py-1 rounded bg-zinc-900 text-white text-sm border-2 border-blue-500">Make an NPC</button>
                    <button onClick={() => { setSubForm(subForm === 'note' ? null : 'note'); setMenuOpen(false) }} className="px-3 py-1 rounded bg-zinc-900 text-white text-sm border-2 border-green-500">Make a Session Note</button>
                  </>
                )}
              </div>
              {subForm && (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  if (!selected) return
                  let res
                  if (subForm === 'encounter') res = await createEncounter(selected.id, subName, subDesc)
                  if (subForm === 'npc') res = await createNpc(selected.id, subName, subDesc)
                  if (subForm === 'note') res = await createNote(selected.id, subName, subDesc)
                  if (res && !res.ok) alert(res.message)
                  else setToast(`${subName} created`)
                  setTimeout(() => setToast(''), 12000)
                  if (selected) {
                    const e2 = await getEncounters(selected.id)
                    const n = await getNpcs(selected.id)
                    const s = await getNotes(selected.id)
                    if (e2.ok) setEncounters(e2.data)
                    if (n.ok) setNpcs(n.data)
                    if (s.ok) setNotes(s.data)
                  }
                  setSubForm(null); setSubName(''); setSubDesc('')
                }} className="space-y-3 mb-4">
                  <input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder={subForm === 'encounter' ? 'Encounter Name' : subForm === 'npc' ? 'Make an NPC Name' : 'Note Title'} required className="w-full px-3 py-2 rounded-lg border" />
                  <textarea value={subDesc} onChange={(e) => setSubDesc(e.target.value)} placeholder="Description" className="w-full px-3 py-2 rounded-lg border" />
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                    {loading ? 'Saving...' : 'Create'} {subForm === 'encounter' ? 'Encounter' : subForm === 'npc' ? 'NPC' : 'Session Note'}
                  </button>
                </form>
              )}
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Dice Roller</h3>
                <div className="flex gap-2 mb-2 items-end">
                  <label className="text-sm text-zinc-900 dark:text-zinc-100">Die
                    <select value={dice} onChange={(e) => setDice(Number(e.target.value))} className="border rounded px-2 py-1 text-zinc-900 dark:text-zinc-100 ml-1">
                      {[2,4,6,8,10,12,20,100].map((d) => <option key={d} value={d} className="text-zinc-900 dark:text-zinc-100">d{d}</option>)}
                    </select>
                  </label>
                  <label className="text-sm text-zinc-900 dark:text-zinc-100">Count
                    <input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} className="border rounded px-2 py-1 w-16 text-zinc-900 dark:text-zinc-100 ml-1" />
                  </label>
                  <label className="text-sm text-zinc-900 dark:text-zinc-100">Modifier
                    <input type="number" value={mod} onChange={(e) => setMod(Number(e.target.value))} className="border rounded px-2 py-1 w-16 text-zinc-900 dark:text-zinc-100 ml-1" />
                  </label>
                  <button onClick={() => {
                    const r: number[] = []
                    let total = 0
                    for (let i = 0; i < count; i++) {
                      const v = Math.floor(Math.random() * dice) + 1
                      r.push(v)
                      total += v
                    }
                    setRolls(r)
                    setRolledMod(mod)
                    setResult(total + mod)
                  }} className="px-3 py-1 rounded bg-zinc-900 text-white text-sm">Roll</button>
                </div>
                {rolls.length > 0 && <p className="text-sm border-2 rounded px-3 py-2 inline-block">🎲 Rolls: {rolls.join(', ')} {rolledMod >= 0 ? '+' : ''}{rolledMod} = {result}</p>}
              </div>
              <div className="mt-4 flex gap-4">
                <div className="flex-1 space-y-2 max-h-40 overflow-auto">
                <p className="font-semibold text-sm">Encounters</p>
                {encounters.map((e) => <p key={e.id} onClick={() => setSelectedEncounter(e)} className="text-sm cursor-pointer">{e.name}</p>)}
                </div>
                <div className="flex-1 space-y-2 max-h-40 overflow-auto">
                  <p className="font-semibold text-sm">NPCs</p>
                  {npcs.map((n) => <p key={n.id} onClick={() => setSelectedNpc(n)} className="text-sm cursor-pointer">{n.name}</p>)}
                </div>
                <div className="flex-1 space-y-2 max-h-40 overflow-auto">
                  <p className="font-semibold text-sm">Session Notes</p>
                  {notes.map((n) => <p key={n.id} onClick={() => setSelectedNote(n)} className="text-sm cursor-pointer">{n.name}</p>)}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm">Close</button>
            </div>
          </div>
        )}
        {selectedEncounter && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedEncounter(null)}>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-2">{selectedEncounter.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{selectedEncounter.description}</p>
              <button onClick={() => setSelectedEncounter(null)} className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm">Close</button>
            </div>
          </div>
        )}
        {selectedNpc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedNpc(null)}>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-2">{selectedNpc.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{selectedNpc.description}</p>
              <button onClick={() => setSelectedNpc(null)} className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm">Close</button>
            </div>
          </div>
        )}
        {selectedNote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedNote(null)}>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-2">{selectedNote.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{selectedNote.description}</p>
              <button onClick={() => setSelectedNote(null)} className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm">Close</button>
            </div>
          </div>
        )}
        {toast && <div className="fixed bottom-4 right-4 bg-green-400 text-black px-4 py-2 rounded-lg font-bold">{toast}</div>}
      </div>
    </div>
  );
}