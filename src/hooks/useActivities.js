import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useActivities(prospectId) {
  const { profile } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!prospectId) return
    fetchActivities()
  }, [prospectId])

  async function fetchActivities() {
    setLoading(true)
    const { data, error } = await supabase
      .from('activities')
      .select('*, advisor:profiles(full_name)')
      .eq('prospect_id', prospectId)
      .order('created_at', { ascending: false })
    if (!error) setActivities(data ?? [])
    setLoading(false)
  }

  async function createActivity(data) {
    const { data: created, error } = await supabase
      .from('activities')
      .insert({ ...data, prospect_id: prospectId, advisor_id: profile.id })
      .select('*, advisor:profiles(full_name)')
      .single()
    if (!error) setActivities((prev) => [created, ...prev])
    return { data: created, error }
  }

  return { activities, loading, createActivity, refetch: fetchActivities }
}
