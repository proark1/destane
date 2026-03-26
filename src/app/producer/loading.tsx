import DashboardLayout from "@/components/DashboardLayout";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="animate-pulse space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <div className="h-3 w-32 bg-surface-container rounded mb-3" />
            <div className="h-10 w-56 bg-surface-container rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-surface-container-low rounded-xl p-6 h-28">
              <div className="h-2 w-24 bg-surface-container-high rounded mb-4" />
              <div className="h-8 w-20 bg-surface-container-high rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-surface-container-low rounded-xl p-6 h-48">
              <div className="flex gap-4">
                <div className="w-20 h-28 bg-surface-container-high rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-32 bg-surface-container-high rounded" />
                  <div className="h-3 w-24 bg-surface-container rounded" />
                  <div className="h-3 w-20 bg-surface-container rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
