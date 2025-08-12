export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col justify-center md:flex-row flex-wrap gap-1 ml-2 mr-2 h-[calc(100vh-110px)]">
      {children}
    </section>
  );
}
