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
    <div className="flex h-full bg-white text-gray-900">
      <aside className="w-[240px] bg-gray-100 border-r border-gray-200 shadow-md sticky top-0 h-full z-20 flex flex-col">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <Header>
          <SignedOut>
          </SignedOut>
          <SignedIn>
          </SignedIn>
        </Header>

        <main className="flex-1 overflow-y-auto bg-gray-50 relative p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 