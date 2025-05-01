export default function Messages() {
  return (
    <div className="h-[calc(100vh-8rem)] flex overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white">
      {/* Conversation List */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-3 border-b border-gray-200 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full py-2 pl-9 pr-3 bg-white border border-gray-200 text-sm rounded-lg focus:ring-1 focus:ring-gray-300 focus:outline-none"
            />
            <div className="absolute top-2.5 left-3 text-gray-400">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 no-scrollbar">
          {/* Active Conversation */}
          <div className="py-3 px-3.5 bg-gray-100 border-l-2 border-black cursor-pointer border-b border-gray-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-gray-900 text-sm truncate">prof_at_school</p>
                </div>
                <p className="text-sm text-gray-600 truncate mt-0.5">I'd be happy to review your research...</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-500">1:42 PM</span>
                <span className="w-5 h-5 bg-black rounded-full text-white text-xs flex items-center justify-center">2</span>
              </div>
            </div>
          </div>
          
          {/* Other Conversations */}
          <div className="py-3 px-3.5 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">code_wizard</p>
                <p className="text-sm text-gray-600 truncate mt-0.5">Let's schedule our first mentoring session</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Yesterday</span>
              </div>
            </div>
          </div>
          
          <div className="py-3 px-3.5 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">tech_mentor88</p>
                <p className="text-sm text-gray-600 truncate mt-0.5">Thanks for your feedback on my project</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Tuesday</span>
              </div>
            </div>
          </div>
          
          <div className="py-3 px-3.5 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">study_buddy42</p>
                <p className="text-sm text-gray-600 truncate mt-0.5">Here's the resource I mentioned earlier</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Last week</span>
              </div>
            </div>
          </div>
          
          <div className="py-3 px-3.5 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">research_expert</p>
                <p className="text-sm text-gray-600 truncate mt-0.5">Did you check out that paper I sent?</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Mar 28</span>
              </div>
            </div>
          </div>
          
          <div className="py-3 px-3.5 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">design_thinker</p>
                <p className="text-sm text-gray-600 truncate mt-0.5">The UI mockups are looking great</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Mar 25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">prof_at_school</p>
          </div>
          <div className="flex gap-1.5">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-4.5 h-4.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.6 11.6L22 7v10l-6.4-4.5v-1zM4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z" />
              </svg>
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-4.5 h-4.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-4.5 h-4.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50 no-scrollbar">
          <div className="flex flex-col space-y-0 max-w-2xl mx-auto p-4">
            {/* Timestamp */}
            <div className="flex justify-center my-2">
              <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/80 border border-gray-100 backdrop-blur-sm">Today, 1:30 PM</span>
            </div>
            
            {/* Their message */}
            <div className="flex items-start gap-1.5 max-w-md mb-1">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-800">Hi user123, I hope you're doing well. I wanted to follow up on your research project. Have you made progress with the literature review section?</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 shrink-0">1:30</span>
            </div>
            
            {/* Your message */}
            <div className="flex items-start self-end gap-1.5 max-w-md mb-1">
              <span className="text-xs text-gray-500 mt-1 shrink-0">1:35</span>
              <div className="bg-black text-white rounded-2xl p-3">
                <p className="text-sm">Hello prof_miller! Yes, I've completed about 75% of the literature review. I've found some interesting papers on the topic we discussed.</p>
              </div>
            </div>
            
            {/* Their message */}
            <div className="flex items-start gap-1.5 max-w-md mb-1">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-800">That's great progress! Could you send me what you have so far? I'd be happy to review it and provide feedback.</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 shrink-0">1:40</span>
            </div>
            
            <div className="flex items-start gap-1.5 max-w-md mb-1">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-800">Also, are you planning to attend the CS department seminar next week? Dr. Zhang from MIT will be speaking about a topic related to your research.</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 shrink-0">1:42</span>
            </div>
            
            {/* Your message */}
            <div className="flex items-start self-end gap-1.5 max-w-md mb-1">
              <span className="text-xs text-gray-500 mt-1 shrink-0">1:45</span>
              <div className="bg-black text-white rounded-2xl p-3">
                <p className="text-sm">I'll send over the draft by tonight. It still needs some work on the methodology section, but I'd appreciate your input on what I have so far.</p>
              </div>
            </div>
            
            {/* Your message */}
            <div className="flex items-start self-end gap-1.5 max-w-md mb-1">
              <span className="text-xs text-gray-500 mt-1 shrink-0">1:46</span>
              <div className="bg-black text-white rounded-2xl p-3">
                <p className="text-sm">Yes, I've registered for the seminar! I'm really looking forward to it. I've read some of Dr. Zhang's papers for my literature review actually.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3 border-t border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 py-2 px-3.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-1 focus:ring-gray-300 focus:outline-none text-sm"
            />
            <button className="p-1.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
