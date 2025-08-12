import { useState, useEffect, useCallback } from 'react'

interface UsePublicDataOptions {
  endpoint: string
  enabled?: boolean
}

interface UsePublicDataReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePublicData<T>({ endpoint, enabled = true }: UsePublicDataOptions): UsePublicDataReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/public/${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [endpoint, enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
} 