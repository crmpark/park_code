import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useWhatsAppTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .order('stage_slug')
        .order('created_at')
      if (error) throw error
      setTemplates(data || [])
    } catch {
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  async function createTemplate(payload) {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .insert([payload])
      .select()
      .single()
    if (!error) setTemplates((prev) => [data, ...prev])
    return { data, error }
  }

  async function updateTemplate(id, payload) {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (!error) setTemplates((prev) => prev.map((t) => (t.id === id ? data : t)))
    return { data, error }
  }

  async function deleteTemplate(id) {
    const { error } = await supabase
      .from('whatsapp_templates')
      .delete()
      .eq('id', id)
    if (!error) setTemplates((prev) => prev.filter((t) => t.id !== id))
    return { error }
  }

  return { templates, loading, createTemplate, updateTemplate, deleteTemplate, refetch: fetchTemplates }
}
