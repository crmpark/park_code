import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useProspects(filters = {}) {
  const { profile, isAdmin } = useAuth()
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProspects = useCallback(async () => {
    if (!profile) return
    setLoading(true)

    let query = supabase
      .from('prospects')
      .select('*, advisor:profiles(full_name, email)')
      .order('created_at', { ascending: false })

    if (!isAdmin) {
      query = query.eq('advisor_id', profile.id)
    }

    if (filters.stage) query = query.eq('pipeline_stage', filters.stage)
    if (filters.sector) query = query.eq('sector', filters.sector)
    if (filters.park_type) query = query.eq('park_type', filters.park_type)
    if (filters.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query
    if (error) setError(error.message)
    else setProspects(data ?? [])
    setLoading(false)
  }, [profile, isAdmin, JSON.stringify(filters)])

  useEffect(() => { fetchProspects() }, [fetchProspects])

  async function createProspect(data) {
    const { data: created, error } = await supabase
      .from('prospects')
      .insert({ ...data, advisor_id: data.advisor_id ?? profile.id })
      .select()
      .single()
    if (!error) setProspects((prev) => [created, ...prev])
    return { data: created, error }
  }

  async function updateProspect(id, data) {
    const { data: updated, error } = await supabase
      .from('prospects')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (!error) {
      setProspects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    }
    return { data: updated, error }
  }

  async function updateStage(id, stage) {
    return updateProspect(id, { pipeline_stage: stage })
  }

  async function deleteProspect(id) {
    const { error } = await supabase.from('prospects').delete().eq('id', id)
    if (!error) setProspects((prev) => prev.filter((p) => p.id !== id))
    return { error }
  }

  return { prospects, loading, error, createProspect, updateProspect, updateStage, deleteProspect, refetch: fetchProspects }
}
