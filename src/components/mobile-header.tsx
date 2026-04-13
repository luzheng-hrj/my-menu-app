export function MobileHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-10 mb-4 rounded-xl border bg-white/90 p-3 backdrop-blur">
      <p className="text-xs text-[hsl(var(--muted-foreground))]">菜单 / 菜谱管理 MVP</p>
      <h1 className="text-lg font-semibold">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p> : null}
    </header>
  );
}
