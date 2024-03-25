'use client';
export const BackButton: React.FC = async () => {
    return (
      <div className="h-12 px-4 py-2 absolute">
        <button onClick={()=> window.history.back()} className="text-slate-600">
          ← Back
        </button>
      </div>
    );
}
