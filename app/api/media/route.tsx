import { NextResponse } from 'next/server'
import axios from 'axios'

const API_KEY = process.env.TMDB_API_KEY
const API_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genreId = searchParams.get('genreId')
  const mediaType = searchParams.get('mediaType') || 'movie'
  const page = Math.floor(Math.random() * 5) + 1 // Random page between 1 and 5

  if (!genreId) {
    return NextResponse.json({ error: 'Genre ID is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/discover/${mediaType}`, {
      params: {
        api_key: API_KEY,
        with_genres: genreId,
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        page: page,
      },
    })

    const results = response.data.results
    if (results.length === 0) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 })
    }

    const randomIndex = Math.floor(Math.random() * results.length)
    const randomMedia = results[randomIndex]

    return NextResponse.json(randomMedia)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}