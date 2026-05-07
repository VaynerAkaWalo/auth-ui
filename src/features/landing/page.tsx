import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const headerRight = (
  <div className="flex items-center gap-4">
    <Link
      to="/login"
      className="inline-flex items-center h-9 px-4 text-sm font-medium tracking-widest uppercase text-foreground hover:bg-foreground hover:text-background transition-colors duration-150"
    >
      Sign in
    </Link>
    <Link
      to="/register"
      className="inline-flex items-center h-9 px-4 text-sm font-medium tracking-widest uppercase brutal-border bg-foreground text-background hover:bg-transparent hover:text-foreground transition-colors duration-150"
    >
      Register
    </Link>
  </div>
)

export default function Landing() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header rightContent={headerRight} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div
          className={`text-center transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="mb-4 inline-block brutal-border px-3 py-1">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted">Identity & Access Control</span>
          </div>

          <h1 className="text-[clamp(5rem,15vw,12rem)] leading-[0.8] tracking-[0.08em] mb-6 select-none">
            BARRICADE
          </h1>

          <div className="w-24 h-1 bg-foreground mx-auto mb-8" />

          <p className="text-lg text-muted max-w-md mx-auto mb-10 font-mono leading-relaxed">
            Secure authentication gateway for modern applications.
            Built for developers who demand control.
          </p>

          <div className="flex items-center justify-center gap-6">
            <Link
              to="/login"
              className="px-10 py-4 brutal-border text-sm tracking-[0.15em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors duration-150"
            >
              Get in
            </Link>
            <Link
              to="/register"
              className="px-10 py-4 brutal-border bg-foreground text-background text-sm tracking-[0.15em] uppercase font-medium hover:bg-transparent hover:text-foreground transition-colors duration-150"
            >
              Register
            </Link>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent transition-opacity duration-1000 delay-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </main>

      <Footer />
    </div>
  )
}
