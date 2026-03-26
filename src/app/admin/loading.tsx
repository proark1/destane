import DashboardLayout from "@/components/DashboardLayout";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-48 bg-surface-container rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-surface-container-low rounded-xl p-6 h-28">
              <div className="h-2 w-24 bg-surface-container-high rounded mb-4" />
              <div className="h-8 w-20 bg-surface-container-high rounded" />
            </div>
          ))}
        </div>
        <div className="bg-surface-container-low rounded-xl p-8 h-96">
          <div className="h-4 w-32 bg-surface-container-high rounded mb-6" />
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-surface-container rounded" />)}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
