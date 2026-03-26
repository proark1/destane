"use client";
import { useRouter } from "next/navigation";

export default function AdminActions({ productionId }: { productionId: number }) {
  const router = useRouter();

  async function handleAction(status: string) {
    await fetch(`/api/productions/${productionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      <button onClick={() => handleAction("funding")}
        className="px-3 py-1.5 rounded bg-green-900/20 text-green-400 text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all">
        Approve
      </button>
      <button onClick={() => handleAction("rejected")}
        className="px-3 py-1.5 rounded bg-red-900/20 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
        Reject
      </button>
    </div>
  );
}
