const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <div className="brutal-border-top px-6 py-3 text-center">
      <span className="text-xs font-mono text-muted">
        BLAMEDEVS {CURRENT_YEAR}
      </span>
    </div>
  )
}
