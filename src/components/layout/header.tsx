interface HeaderProps {
  rightContent?: React.ReactNode;
}

export function Header({ rightContent }: HeaderProps) {
  return (
    <header className="brutal-border-bottom px-6 py-3 flex items-center justify-between bg-background">
      <h1 className="text-3xl tracking-[0.12em] m-0">BARRICADE</h1>
      {rightContent && <div>{rightContent}</div>}
    </header>
  );
}
