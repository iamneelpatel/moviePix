'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Film, Loader, Tv } from 'lucide-react'
import axios from 'axios'
import Image from 'next/image';

interface Media {
  id: number
  title: string
  name: string
  overview: string
  poster_path: string
  release_date: string
  first_air_date: string
}

const moods = [
  { emoji: '😊', text: 'COMEDY', genreId: 35 }, // Comedy
  { emoji: '🤔', text: 'MYSTERY', genreId: 9648 }, // Mystery
  { emoji: '😔', text: 'DRAMA', genreId: 18 }, // Drama
  { emoji: '😂', text: 'AMUSED', genreId: 35 }, // Comedy
  { emoji: '😌', text: 'SERENE', genreId: 99 }, // Documentary
  { emoji: '😎', text: 'ACTION', genreId: 28 }, // Action
  { emoji: '😍', text: 'ROMANCE', genreId: 10749 }, // Romance
  { emoji: '🤪', text: 'QUIRKY', genreId: 878 }, // Science Fiction
  { emoji: '😴', text: 'RELAXED', genreId: 16 }, // Animation
  { emoji: '😡', text: 'INTENSE', genreId: 53 }, // Thriller
  { emoji: '😨', text: 'THRILLED', genreId: 27 }, // Horror
  { emoji: '😞', text: 'HISTORIC', genreId: 36 }, // History
  { emoji: '😰', text: 'SUSPENSEFUL', genreId: 80 }, // Crime
  { emoji: '🤓', text: 'CURIOUS', genreId: 99 }, // Documentary
  { emoji: '🤩', text: 'ADVENTUROUS', genreId: 12 }, // Adventure
  { emoji: '😄', text: 'FAMILY', genreId: 10751 }, // Family
]

export default function LandingPage() {
  const [selectedMood, setSelectedMood] = useState('')
  const [currentMedia, setCurrentMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie')

  const fetchMedia = async (genreId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/media', {
        params: { genreId: genreId, mediaType: mediaType },
      })
      setCurrentMedia(response.data)
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch ${mediaType}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoodSelect = (mood: string, genreId: number) => {
    setSelectedMood(mood)
    fetchMedia(genreId)
  }

  const toggleMediaType = () => {
    setMediaType(mediaType === 'movie' ? 'tv' : 'movie')
    if (selectedMood) {
      const selectedMoodData = moods.find(m => m.text === selectedMood)
      if (selectedMoodData) {
        fetchMedia(selectedMoodData.genreId)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 text-white">
      <header className="p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-amber-400" />
            <span className="text-2xl font-bold">MoviePix</span>
          </div>
          <button
            onClick={toggleMediaType}
            className="bg-purple-800 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
          >
            {mediaType === 'movie' ? (
              <>
                <Tv className="inline-block mr-2 h-4 w-4" />
                Looking for TV Shows?
              </>
            ) : (
              <>
                <Film className="inline-block mr-2 h-4 w-4" />
                Looking for Movies?
              </>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-6 sm:text-5xl md:text-6xl">
            Find Your Perfect Cinematic Experience
          </h1>
          <p className="text-xl mb-12 text-purple-200">
            Whats your {mediaType === 'movie' ? 'movie' : 'TV show'} mood today?
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {moods.map((mood) => (
            <motion.button
              key={mood.text}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood.text, mood.genreId)}
              className={`p-4 rounded-lg border-2 border-purple-500 hover:border-amber-400 transition-colors ${
                selectedMood === mood.text ? 'bg-purple-600' : 'bg-purple-800'
              }`}
            >
              <span className="text-2xl mb-2 block">{mood.emoji}</span>
              <span className="font-medium">{mood.text}</span>
            </motion.button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-12 text-center">
            <Loader className="inline-block animate-spin text-amber-400 h-8 w-8" />
            <p className="mt-2 text-purple-200">Finding the perfect {mediaType === 'movie' ? 'movie' : 'TV show'} for you...</p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-red-400"
          >
            {error}
          </motion.div>
        )}

        {currentMedia && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 bg-purple-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">{currentMedia.title || currentMedia.name}</h2>
            <div className="flex flex-col md:flex-row">
              <Image
                src={`https://image.tmdb.org/t/p/w500${currentMedia.poster_path}`}
                alt={currentMedia.title || currentMedia.name}
                width={500}
                height={500}
                className="w-full md:w-1/3 h-auto object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
              />
              <div>
                <p className="mb-4">{currentMedia.overview}</p>
                <p className="text-sm text-purple-300">
                  {mediaType === 'movie' ? 'Release Date:' : 'First Air Date:'} {currentMedia.release_date || currentMedia.first_air_date}
                </p>
                <button
                  onClick={() => fetchMedia(moods.find(m => m.text === selectedMood)?.genreId || 0)}
                  className="mt-4 bg-amber-400 text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-amber-300 transition-colors"
                >
                  Next {mediaType === 'movie' ? 'Movie' : 'TV Show'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-12 py-6 text-center text-purple-300">
        <p>Crafted by Neel Patel 🎬 </p>
      </footer>
    </div>
  )
}