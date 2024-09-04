
export default function BeneficiaryLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <section className="flex flex-row items-center justify-center gap-4 md:py-1 md:px-4">
         { children}
      </section>
   )
}