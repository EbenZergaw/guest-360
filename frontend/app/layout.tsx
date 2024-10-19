"use client"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import Navbar from '../components/Navbar'
import { GuestsProvider } from '../context/GuestContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <GuestsProvider>
      <html lang="en">
        <body className='max-w-5xl mx-auto'>
          <Navbar />
          
          {children}
        </body>
      </html>
      </GuestsProvider>
    </ClerkProvider>
  )
}