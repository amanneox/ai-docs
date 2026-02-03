export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0f0a]" data-theme="dark">
      {children}
    </div>
  )
}
