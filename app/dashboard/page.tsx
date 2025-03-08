"use server"

export default async function DashboardPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-3xl font-bold">Protected Dashboard</h1>
      <p className="text-muted-foreground text-lg">
        Add your user functionality here
      </p>
    </div>
  )
}
