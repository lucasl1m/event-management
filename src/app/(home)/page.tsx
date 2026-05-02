export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Início
        </h1>
        <p className="text-sm text-muted-foreground">Visão geral dos seus eventos e métricas.</p>
      </div>
    </div>
  );
}
