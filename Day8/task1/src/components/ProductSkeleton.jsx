export default function ProductSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-smm-border" />
          <div className="mt-2 space-y-2 px-1">
            <div className="h-3 w-1/3 bg-smm-border" />
            <div className="h-3 w-full bg-smm-border" />
            <div className="h-3 w-2/3 bg-smm-border" />
          </div>
        </div>
      ))}
    </div>
  )
}
