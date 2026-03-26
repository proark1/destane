"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-error-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-error text-3xl">error</span>
        </div>
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-on-surface mb-3">
          Something went wrong
        </h2>
        <p className="text-on-surface-variant text-sm mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="btn-gold text-on-primary font-bold px-8 py-3 rounded-md text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
