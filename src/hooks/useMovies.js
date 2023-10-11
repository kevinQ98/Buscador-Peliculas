import { useState, useRef, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previousSearch = useRef(search)

  const getMovies = useCallback(async ({ search }) => {
    if (previousSearch.current === search) return

    try {
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (e) {
      setError(e)
    } finally {
      // tanto en el try como en el catch
      setLoading(false)
    }
  }, [])

  const sortMovies = useMemo(() => {
    return sort && movies ?
      [...movies].sort((a, b) => b.year - a.year)
      : movies
  }, [movies, sort])

  return { movies: sortMovies, getMovies, loading }
}