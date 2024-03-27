'use client';
export function BackButton() {
  return (
    <div className="h-12 px-4 py-2 absolute">
      <button onClick={()=> window.history.back()} className="text-slate-600">
        ← Back
      </button>
    </div>
  );
}
