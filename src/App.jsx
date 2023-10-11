import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirtsInput = useRef(true)

  useEffect(() => {
    if (isFirtsInput.current) {
      isFirtsInput.current = search === ''
      return
    }

    if (search === '') {
      setError('¡Ups! No hay magia sin palabras')
      return
    }
    if (search.length < 3) {
      setError('Más letras, por favor')
      return
    }

    setError(null)
  }, [search])

  return { search, error, updateSearch }
}

function App() {
  const [sort, setSort] = useState(false)

  const { search, error, updateSearch } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce(search => {
      console.log('search', search)
      getMovies({ search })
    }, 500)
    , [getMovies]
  )

  const handleSort = () => {
    setSort(!sort)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  return (
    <div className='page'>
      <h1 className='title'>BuscaPelis</h1>
      <header>
        <form className='form' onSubmit={handleSubmit}>

          <input onChange={handleChange} value={search} name='query' type="text" placeholder='Pelicula/Serie favorita' autoComplete='off' />

          <label htmlFor="" className='label-sort'>Ordenar por Año</label>
          <label className="container-check">
            <input type="checkbox" onChange={handleSort} checked={sort} />
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path"></path>
            </svg>
          </label>

          <button className='button-search' type='submit'>Buscar</button>
        </form>
        {error && <p className='label-error'>{error}</p>}
      </header>

      <main>
        {loading ? <p>Cargando...</p> :
          <Movies movies={movies} />}
      </main>
    </div>
  )
}

export default App
