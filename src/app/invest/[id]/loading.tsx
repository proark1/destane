export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-container-lowest pt-20 animate-pulse">
      <div className="h-[400px] bg-surface-container" />
      <div className="max-w-7xl mx-auto px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-8 w-24 bg-surface-container rounded" />)}
          </div>
          <div className="h-6 w-48 bg-surface-container-high rounded" />
          <div className="h-4 w-full bg-surface-container rounded" />
          <div className="h-4 w-3/4 bg-surface-container rounded" />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-surface-container-low rounded-2xl p-8 h-96" />
        </div>
      </div>
    </div>
  );
}
