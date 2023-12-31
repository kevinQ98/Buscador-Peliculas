const API_KEY = 'bf2e4110'

export async function searchMovies({ search }) {
    if (search === '') return null

    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`)
        const data = await response.json()

        const movies = data.Search

        return movies?.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster,
            year: movie.Year,
        }))
    } catch (error) {
        throw new Error('Error searching for movies')
    }
}

