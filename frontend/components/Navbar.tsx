"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const { user } = useUser();

  return (
    <nav className="bg-background">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-primary">Guest360</span>
            </Link>

            
          </div>
          <div className="hidden md:block">

            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
                <div className="flex items-center gap-2">
                    {
                        user && (
                            <div className="text-xl font-bold">{user.username?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                        )
                    }
                <UserButton />
                </div>
            </SignedIn>
          </div>
          <div className="flex md:hidden">
            {" "}
            {/* Updated to flex */}
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

    </nav>
  );
}
