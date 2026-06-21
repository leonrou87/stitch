export default function Loading() {
  return (
    <div aria-hidden>
      <section className="container-wide pt-12">
        <div className="animate-pulse">
          <div className="h-4 w-48 rounded bg-paper-edge" />
          <div className="mt-3 h-7 w-64 rounded bg-paper-edge" />
          <div className="mt-2 h-4 w-full max-w-prose rounded bg-paper-edge" />

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="h-32 w-full rounded bg-paper-edge" />
                <div className="mt-4 h-5 w-2/3 rounded bg-paper-edge" />
                <div className="mt-2 h-4 w-full rounded bg-paper-edge" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-12">
        <div className="animate-pulse grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="h-40 w-full rounded bg-paper-edge" />
              <div className="mt-4 h-5 w-2/3 rounded bg-paper-edge" />
              <div className="mt-2 h-4 w-full rounded bg-paper-edge" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
