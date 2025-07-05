import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleExplain = async () => {
    if (!topic.trim()) return

    setIsLoading(true)
    setExplanation('')

    try {
      const response = await fetch('http://localhost:3001/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to get explanation')
      }

      const data = await response.json()
      setExplanation(data.explanation || 'No explanation received')
    } catch (error) {
      console.error('Error:', error)
      setExplanation('Sorry, something went wrong! Please try again. 😔')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated Heading */}
      <motion.h1 
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 sm:mb-8 text-center px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        EILI5 🧠🍼
      </motion.h1>

      {/* Main Content Container */}
      <div className="w-full max-w-[90%] sm:max-w-2xl space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Textarea Input */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3 sm:space-y-4"
        >
          <label htmlFor="topic" className="block text-base sm:text-lg font-semibold text-gray-700">
            What would you like me to explain?
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter any topic you'd like explained in simple terms..."
            className="w-full h-28 sm:h-32 p-4 sm:p-6 border-2 border-gray-300 rounded-xl resize-none focus:border-pink-400 focus:outline-none text-gray-700 bg-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
            disabled={isLoading}
          />
        </motion.div>

        {/* Pink Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center pt-2 sm:pt-4"
        >
          <button
            onClick={handleExplain}
            disabled={!topic.trim() || isLoading}
            className={`px-6 sm:px-10 py-4 sm:py-5 font-bold text-base sm:text-lg rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 ${
              isLoading 
                ? 'bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-[length:200%_100%] animate-shimmer cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 hover:shadow-xl transform hover:scale-105'
            } ${!topic.trim() ? 'bg-gray-300 cursor-not-allowed' : 'text-white'}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="animate-pulse">Thinking...</span>
              </>
            ) : (
              'Explain it like I\'m 5! 🎈'
            )}
          </button>
        </motion.div>

        {/* Explanation Card */}
        {(explanation || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-l-4 border-pink-400"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              {isLoading ? 'Getting your explanation... 🌟' : 'Here\'s your explanation: 🌟'}
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
            ) : (
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {explanation}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App
