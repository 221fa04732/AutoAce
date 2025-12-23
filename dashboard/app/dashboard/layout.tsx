import Header from "@/components/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<main>
    <div className="fixed top-0 w-full bg-black z-50">
      <Header />
    </div>
    {children}
  </main>
)}
