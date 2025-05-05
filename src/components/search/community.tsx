'use client'

import Link from 'next/link'
import Image from 'next/image' 
import { motion } from 'framer-motion'

interface CommunityProps {
  id: string
  name: string
  memberCount: number
  description: string
  image: string
  tags: string[]
}

const Community = ({ id, name, memberCount, description, image, tags }: CommunityProps) => {
  return (
    <Link href={`/communities/${id}`}>
      <motion.div 
        className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-700">
            <Image 
              src={image} 
              alt={name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-white">{name}</h3>
            <p className="text-sm text-gray-400">{memberCount.toLocaleString()} members</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>
    </Link>
  )
}

export default Community
