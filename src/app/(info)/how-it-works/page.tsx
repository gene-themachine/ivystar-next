'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'Students' | 'Mentors'>('Students')
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4 mb-10">
          <Link href="/" aria-label="Go to home">
            <div className="w-64 h-64 mx-auto relative hover:opacity-90 transition-opacity">
              <Image
                src="/ivystar-logo.png"
                alt="Ivystar Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white">How It Works</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'Students' ? 'text-white border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('Students')}
          >
            Students
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'Mentors' ? 'text-white border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('Mentors')}
          >
            Mentors
          </button>
        </div>

        {activeTab === 'Students' && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-white">For Students</h2>
          <p className="text-white text-lg">
            Ivystar is a space to build new skills, explore your interests, and learn something meaningful on
            your own terms.
          </p>
          <ol className="space-y-4 list-decimal list-inside text-white marker:text-orange-300 marker:text-xl marker:font-bold">
            <li>
              <span className="font-semibold text-white">Create your profile</span>
              <p className="text-white mt-1">
                Pick a fun, one-of-a-kind username you haven't used anywhere else. You'll stay completely
                anonymous so you can focus on learning, not performing.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Ask a question</span>
              <p className="text-white mt-1">
                It can be about school, a personal project, or something you've just been curious about. Mentors
                respond with honest insight based on real-world experience.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Save the mentors you like</span>
              <p className="text-white mt-1">
                If a mentor's response or profile speaks to you, you can save them to your personal list. It's a way
                to keep track of the mentors you want to learn from later.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Book a one-on-one session (no video)</span>
              <p className="text-white mt-1">
                When you're ready, book a session with someone from your saved list. All sessions are audio-based or
                text-based, so there's no pressure to be on camera.
              </p>
              <div className="mt-4">
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfTtqSVG_Dtrwqxgi8aKqSzYDYlNfE_FMFbvVLvIjz6nGRnPg/viewform" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book a Session
                </a>
              </div>
              <p className="text-gray-400 mt-2 text-sm">
                You'll be charged before your session is booked, and your Zoom link will be sent right after.
              </p>
            </li>
          </ol>
        </section>
        )}

        {activeTab === 'Mentors' && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-white">For Mentors</h2>
          <p className="text-white text-lg">
            Ivystar is where you can make an impact by sharing what you've learned with students who are eager to
            grow.
          </p>
          <ol className="space-y-4 list-decimal list-inside text-white marker:text-orange-300 marker:text-xl marker:font-bold">
            <li>
              <span className="font-semibold text-white">Create your profile</span>
              <p className="text-white mt-1">
                Choose a unique Ivystar username and build a portfolio with your projects, writing, or ideas. It
                helps students get a feel for your voice, experience, and style—no photo or real name.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Answer student questions</span>
              <p className="text-white mt-1">
                Browse open questions and reply to the ones that spark your interest. A thoughtful answer can make
                all the difference for a student finding their way.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Get saved by students</span>
              <p className="text-white mt-1">
                When a student connects with your answer or profile, they can save you to their list and may reach
                out to book a session.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Complete your mentor vetting</span>
              <p className="text-white mt-1">
                Before you can start taking one-on-one sessions, you'll need to be vetted by our team. Please fill
                out this short form to schedule an interview and begin the process.
              </p>
              <div className="mt-4">
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeq4eMLxIyvXWp64R2vAtjDjyRrOwKP-e5lWdAJwwWSVd12jg/viewform" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Apply as a Mentor
                </a>
              </div>
            </li>
            <li>
              <span className="font-semibold text-white">Show your availability</span>
              <p className="text-white mt-1">
                Once approved, create and share your calendar link directly on your profile. Showing your maximum
                availability makes it easier for students to book with you.
                <Link href="https://www.when2meet.com" target="_blank" className="text-blue-400 underline hover:text-blue-300">
                  when2meet.com
                </Link>
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Host one-on-one sessions (no video)</span>
              <p className="text-white mt-1">
                All sessions are voice-only or text-based, so students can focus on learning without the pressure of
                being on camera.
              </p>
            </li>
            <li>
              <span className="font-semibold text-white">Get paid on the 1st and 15th</span>
              <p className="text-white mt-1">
                Payments are sent via direct deposit twice a month for all completed sessions.
              </p>
            </li>
          </ol>
        </section>
        )}
      </div>
    </div>
  )
}