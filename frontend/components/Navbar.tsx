"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-background">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-primary">Guest360</span>
            </Link>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">

            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
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

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground block px-3 py-2 rounded-md text-base font-medium"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-primary/10">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
