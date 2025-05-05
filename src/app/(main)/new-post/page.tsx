'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages = Array.from(files)
    setImages(prev => [...prev, ...newImages])
    
    // Create and set preview URLs
    const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file))
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newPreviewUrls = [...imagePreviewUrls]
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])
    
    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)
    
    setImages(newImages)
    setImagePreviewUrls(newPreviewUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // This would be replaced with your actual API call
      console.log('Submitting post:', { title, content, images })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success - redirect to home or post view
      router.push('/')
    } catch (err) {
      console.error('Error creating post:', err)
      setError('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Create New Post</h1>
          <p className="text-gray-400 mt-1">Share your thoughts with the Ivystar community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-red-900/30 border border-red-800 text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {/* Title input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your post about?"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#0387D0] transition"
            />
          </div>
          
          {/* Content textarea */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Post Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, questions, or ideas..."
              rows={6}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#0387D0] transition resize-y"
            />
          </div>
          
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add Images (Optional)
            </label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-gray-700 rounded-md p-6 text-center cursor-pointer hover:border-gray-500 transition"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <svg
                className="w-8 h-8 mx-auto text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-400">
                Click to upload images
              </p>
            </div>
            
            {/* Image previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden h-24 bg-gray-800">
                    <Image
                      src={url}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-gray-900/80 p-1 rounded-full text-white hover:bg-red-600/80 transition"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 font-medium rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-[#0387D0] text-white font-medium rounded-md hover:bg-[#0387D0]/90 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : (
                'Publish Post'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
