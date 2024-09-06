import Page  from './beneficiaries/page'

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 md:py-1 md:px-4">
      <div className="flex flex-col">
        <Page />
      </div>
    </section>
  );
}
