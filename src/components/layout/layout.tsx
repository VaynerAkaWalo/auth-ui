import { Header } from './header'
import { Footer } from './footer'

interface LayoutProps {
  children: React.ReactNode
  headerRightContent?: React.ReactNode
  sidebar?: React.ReactNode
}

export function Layout({ children, headerRightContent, sidebar }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header rightContent={headerRightContent} />
      <div className="flex-1 flex">
        {sidebar}
        <main className={`flex-1 ${sidebar ? 'p-6' : 'flex items-center justify-center p-6'}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
