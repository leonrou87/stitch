export default function Loading() {
  return (
    <div className="container-wide mx-auto max-w-prose py-14" aria-hidden>
      <div className="animate-pulse">
        <div className="h-9 w-3/4 rounded bg-paper-edge" />
        <div className="mt-4 h-4 w-full rounded bg-paper-edge" />
        <div className="mt-2 h-4 w-5/6 rounded bg-paper-edge" />

        <div className="mt-10 space-y-8">
          {Array.from({ length: 3 }).map((_, day) => (
            <div key={day}>
              <div className="h-5 w-32 rounded bg-paper-edge" />
              <div className="mt-4 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="card p-5">
                    <div className="h-5 w-1/2 rounded bg-paper-edge" />
                    <div className="mt-3 h-4 w-full rounded bg-paper-edge" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-paper-edge" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
