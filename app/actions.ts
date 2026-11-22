'use server'

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!)

function hashPassword(pw: string) {
  return crypto.createHash('sha256').update(pw).digest('hex')
}

export async function registerUser(email: string, password: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Invalid email' }
  if (!password || password.length < 6) return { ok: false, message: 'Password too short' }
  const { error } = await supabase.from('users').insert({ email, password: hashPassword(password) })
  if (error) return { ok: false, message: error.message }
  return { ok: true, message: 'Registered' }
}

export async function testSupabase() {
  const { error } = await supabase.from('users').select('email').limit(1)
  if (error) return { ok: false, message: error.message }
  return { ok: true, message: 'Connected' }
}
export async function createCampaign(title: string, description: string, userId?: string) {
  console.log('createCampaign userId:', userId)
  if (!title) return { ok: false, message: 'Missing fields' }
  const { error } = await supabase.from('campaigns').insert({ title, description, 'gm-id': userId || null })
  if (error) return { ok: false, message: error.message }
  return { ok: true, message: 'Created' }
}
export async function getCampaigns() {
  const { data, error } = await supabase.from('campaigns').select('id,title,description')
  if (error) return { ok: false, message: error.message, data: [] }
  return { ok: true, message: 'OK', data: data || [] }
}
export async function createEncounter(campaignId: string, name: string, description: string) {
  const { error } = await supabase.from('encounters').insert({ campaignsId: campaignId, name, description })
  if (error) return { ok: false, message: error.message }
  return { ok: true, message: 'Created' }
}
export async function getEncounters(campaignId: string) {
  const { data, error } = await supabase.from('encounters').select('id,name,description').eq('campaignsId', campaignId)
  if (error) return { ok: false, message: error.message, data: [] }
  return { ok: true, message: 'OK', data: data || [] }
}
export async function createNpc(campaignId: string, name: string, description: string) {
  const { error } = await supabase.from('npcs').insert({ campaignsId: campaignId, name, description })
  if (error) return { ok: false, message: error.message }
  return { ok: true, message: 'Created' }
}
export async function getNpcs(campaignId: string) {
  const { data, error } = await supabase.from('npcs').select('id,name,description').eq('campaignsId', campaignId)
  if (error) return { ok: false, message: error.message, data: [] }
  return { ok: true, message: 'OK', data: data || [] }
}
export async function createNote(campaignId: string, name: string, description: string) {
  const { error } = await supabase.from('sessionNotes').insert({ campaignsId: campaignId, name, description })
  if (error) return { ok: false, message: error.message }
  return { ok: true, message: 'Created' }
}
export async function getNotes(campaignId: string) {
  const { data, error } = await supabase.from('sessionNotes').select('id,name,description').eq('campaignsId', campaignId)
  if (error) return { ok: false, message: error.message, data: [] }
  return { ok: true, message: 'OK', data: data || [] }
}
export async function loginUser(email: string, password: string) {
  if (!email || !password) return { ok: false, message: 'Missing fields' }
  const { data, error } = await supabase.from('users').select('id,email,password').eq('email', email).single()
  if (error || !data) return { ok: false, message: 'User not found' }
  if (data.password !== hashPassword(password)) return { ok: false, message: 'Invalid password' }
  const token = Buffer.from(email).toString('base64')
  return { ok: true, message: 'Logged in', token, userId: data.id }
}
