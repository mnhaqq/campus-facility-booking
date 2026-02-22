import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Generic data-fetching hook.
 *
 * @param {() => Promise} fetchFn   — async function that returns an axios response
 * @param {Array}         deps      — dependency array (re-runs when these change)
 * @param {object}        options
 * @param {boolean}       options.skip  — set true to skip the initial fetch
 *
 * @returns {{ data, loading, error, refetch }}
 */
export function useFetch(fetchFn, deps = [], { skip = false } = {}) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(!skip)
  const [error,   setError]   = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchFn()
      if (mountedRef.current) setData(response.data)
    } catch (err) {
      if (mountedRef.current) setError(err.userMessage ?? 'Failed to fetch data.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (!skip) execute()
  }, [execute, skip])

  return { data, loading, error, refetch: execute }
}
