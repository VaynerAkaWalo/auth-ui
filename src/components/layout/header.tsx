interface HeaderProps {
  rightContent?: React.ReactNode;
}

export function Header({ rightContent }: HeaderProps) {
  return (
    <header className="w-full px-4 py-4 border-b bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">BLAME DEVS</h1>
        {rightContent && <div>{rightContent}</div>}
      </div>
    </header>
  );
}
