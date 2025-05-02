import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Link from 'next/link'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-full bg-gray-900 text-white">
      <aside className="w-[240px] bg-gray-900 border-r border-gray-800 shadow-md sticky top-0 h-full z-20 flex flex-col">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-900">
        <Header>
          <SignedOut>
          </SignedOut>
          <SignedIn>
          </SignedIn>
        </Header>

        <main className="flex-1 overflow-y-auto bg-gray-950 relative">
          {children}
        </main>
      </div>
    </div>
  )
} 