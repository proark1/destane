import DashboardLayout from "@/components/DashboardLayout";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="animate-pulse space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <div className="h-3 w-32 bg-surface-container rounded mb-3" />
            <div className="h-10 w-48 bg-surface-container rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-surface-container-low rounded-xl overflow-hidden h-64">
              <div className="h-36 bg-surface-container" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-40 bg-surface-container-high rounded" />
                <div className="h-3 w-24 bg-surface-container rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
