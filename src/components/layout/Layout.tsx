import { Header } from './header'
import { Footer } from './footer'

interface LayoutProps {
  children: React.ReactNode
  headerRightContent?: React.ReactNode
}

export function Layout({ children, headerRightContent }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header rightContent={headerRightContent} />
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}
