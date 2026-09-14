export function PageHeader({ title, intro, children }) {
  return (
    <header className="space-y-2">
      <h1 className="page-heading">{title}</h1>
      {intro ? <p className="page-intro">{intro}</p> : null}
      {children}
    </header>
  );
}
