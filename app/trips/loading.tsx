export default function Loading() {
  return (
    <div className="container-wide py-14" aria-hidden>
      <div className="animate-pulse">
        <div className="h-10 w-56 rounded bg-paper-edge" />
        <div className="mt-3 h-4 w-full max-w-prose rounded bg-paper-edge" />
        <div className="mt-2 h-4 w-2/3 max-w-prose rounded bg-paper-edge" />

        {Array.from({ length: 2 }).map((_, s) => (
          <section key={s} className="mt-12">
            <div className="flex items-end justify-between">
              <div className="h-7 w-40 rounded bg-paper-edge" />
              <div className="h-4 w-28 rounded bg-paper-edge" />
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-5">
                  <div className="h-32 w-full rounded bg-paper-edge" />
                  <div className="mt-4 h-5 w-2/3 rounded bg-paper-edge" />
                  <div className="mt-2 h-4 w-full rounded bg-paper-edge" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
