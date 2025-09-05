import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

const LandingPage = async () => {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-20 border-b bg-white/70 backdrop-blur-md dark:bg-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo-dark.png"
              alt="Aeris Logo"
              width={50}
              height={50}
              className="block rounded dark:hidden"
            />
            <Image
              src="/logo-light.png"
              alt="Aeris Logo"
              width={50}
              height={50}
              className="hidden rounded dark:block"
            />
            <span className="text-xl font-bold">Aeris</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <UserButton />
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Background pattern */}
      <div className="absolute top-0 right-0 bottom-0 left-0 z-[-1] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_80%)] bg-[size:14px_24px]" />

      {/* Main content */}
      <div className="relative z-[10] flex min-h-screen flex-col items-center pt-56">
        <h1 className="inline-block bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-center text-6xl font-bold text-transparent dark:text-gray-300">
          The minimalistic, <br />
          AI-powered email client.
        </h1>
        <p className="mt-4 mb-8 max-w-xl text-center text-xl text-gray-600 dark:text-gray-300">
          Aeris is a minimalistic, AI-powered email client that empowers you to
          manage your email with ease.
        </p>
        <div className="space-x-4">
          <Button>
            <Link href="/mail">Get Started</Link>
          </Button>
          <Link href="">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
        {/* Features */}
        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-semibold">
            Experience the power of:
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-md dark:bg-neutral-900">
              <h3 className="mb-2 text-xl font-semibold">
                AI-driven email RAG
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatically prioritize your emails with our advanced AI
                system.
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-md dark:bg-neutral-900">
              <h3 className="mb-2 text-xl font-semibold">Full-text search</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quickly find any email with our powerful search functionality.
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-md dark:bg-neutral-900">
              <h3 className="mb-2 text-xl font-semibold">
                Shortcut-focused interface
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Navigate your inbox efficiently with our intuitive keyboard
                shortcuts.
              </p>
            </div>
          </div>
        </div>
        {/* About / Why Aeris */}
        <section className="mx-auto mt-20 max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold">Why Aeris?</h2>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Email is broken. We’re drowning in promotions, threads, and clutter.
            Aeris takes a new approach: a minimalistic, distraction-free inbox
            powered by AI to help you focus on what truly matters.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            With blazing-fast search, intelligent prioritization, and a
            keyboard-first interface, Aeris is built for productivity lovers who
            want to reclaim control over their email.
          </p>
        </section>
        {/* Demo image */}{" "}
        <Image
          src="/demo.png"
          alt="demo"
          width={1000}
          height={1000}
          className="mt-20 h-auto w-[70vw] rounded-md border shadow-xl transition-all hover:scale-[102%] hover:shadow-2xl"
        />
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t bg-white/70 py-10 dark:bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Aeris. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="" className="hover:underline">
              About
            </Link>
            <Link href="" className="hover:underline">
              Privacy
            </Link>
            <Link href="" className="hover:underline">
              Terms
            </Link>
            <Link href="" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
