export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-container-lowest pt-24 px-6">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-3 w-32 bg-surface-container rounded mb-3" />
        <div className="h-10 w-48 bg-surface-container rounded mb-10" />
        <div className="flex gap-3 mb-10">
          {[1,2,3,4].map(i => <div key={i} className="h-9 w-24 bg-surface-container rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-panel rounded-xl overflow-hidden">
              <div className="h-48 bg-surface-container" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-40 bg-surface-container-high rounded" />
                <div className="h-3 w-full bg-surface-container rounded" />
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
