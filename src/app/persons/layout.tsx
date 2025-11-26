export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <div className="ml-2 mr-2 my-2">{children}</div>;
}
