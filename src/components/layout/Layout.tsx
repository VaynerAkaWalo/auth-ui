import { Header } from './Header'
import { Footer } from './Footer'

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
