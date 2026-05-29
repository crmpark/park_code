import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAdvisors() {
  const [advisors, setAdvisors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAdvisors() }, [])

  async function fetchAdvisors() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('active', true)
      .order('full_name')
    setAdvisors(data ?? [])
    setLoading(false)
  }

  async function createAdvisor(email, password, fullName, phone) {
    const { data, error } = await supabase.functions.invoke('create-advisor', {
      body: { email, password, full_name: fullName, phone },
    })
    if (!error) await fetchAdvisors()
    return { data, error }
  }

  async function updateAdvisor(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setAdvisors((prev) => prev.map((a) => (a.id === id ? data : a)))
    return { data, error }
  }

  return { advisors, loading, createAdvisor, updateAdvisor, refetch: fetchAdvisors }
}
