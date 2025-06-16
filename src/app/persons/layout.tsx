export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col justify-center md:flex-row flex-wrap gap-1 ml-2 mr-2 min-h-[530px] 2xl:min-h-[810px]">
      {children}
    </section>
  );
}
