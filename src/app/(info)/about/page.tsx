'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <Link href="/" aria-label="Go to home">
              <div className="mx-auto w-56 h-56 mb-6 relative hover:opacity-90 transition-opacity">
                <Image 
                  src="/ivystar-logo.png" 
                  alt="Ivystar" 
                  width={224}
                  height={224}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-orange-500">
            Our vision is for everyone to have a mentor
            </h2>
          </div>

          {/* Mission Statement */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Vision</h2>
            <p className="text-lg text-white">
              Ivystar connects learners with mentors in a space where ideas flourish without judgment.
            </p>
            <p className="text-lg mt-4 font-medium text-white border-l-4 border-orange-300 pl-3">
              Practice here. Be brave out there.
            </p>
          </div>

          {/* Story & Offerings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Our Story</h2>
              <p className="text-white mb-2">
              Incubated at Harvard Innovation Labs since 2024, Ivystar is a safe and trusted space where students grow, ask bold questions, and build lasting confidence — all without fear of judgment. We connect students with mentors who've walked similar paths, creating bridges between lived experience and future ambition.
              </p>
              <p className="text-white mb-2">
              The heart of Ivystar has been years in the making. Since 2012, our founder — a Harvard alum — has worked alongside families to create spaces where learning feels personal, powerful, and full of possibility. One belief stayed constant: <em>one mentor can change a life.</em>
              </p>
              <p className="text-white mb-2">
              Ivystar is a brand-new platform, but it carries forward the same mission of meaningful mentorship. It's now reimagined for an anonymous online world where every student has access to a mentor who inspires them to dream big.
              </p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-white">What We Offer</h3>
              <ul className="space-y-3">
                {[
                  "A safe, anonymous space where ideas flow freely and curiosity is celebrated",
                  "Mentorship that inspires confidence, purpose, and growth",
                  "Real-world skill-building designed to empower students beyond the classroom",
                  "A supportive community that values reflection, resilience, and becoming your best self"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-300 mt-1 text-xl font-bold">•</span>
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recognition */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Recognition</h2>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-orange-300 bg-opacity-20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-100">2024 Harvard Innovation Labs Venture</h3>
                  <Link 
                    href="https://innovationlabs.harvard.edu" 
                    className="text-orange-300 hover:text-orange-200 transition flex items-center gap-1 mt-1"
                  >
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Join Us CTA */}
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Join The Movement</h2>
            <p className="text-white mb-6 max-w-xl mx-auto">
              Find your mentors. Develop your skills. Build your future.
            </p>
            <Link 
              href="/sign-up" 
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg shadow-lg font-medium transition duration-200 inline-flex items-center gap-2"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}