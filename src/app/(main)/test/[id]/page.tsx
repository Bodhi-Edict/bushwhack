import { unstable_noStore as noStore } from "next/cache";
import { api } from "~/trpc/server";
import { TestAttempt } from "./_components/test-attempt";

export default async function Test({ params }: { params: { id: string } }) {
  noStore();
  const test = await api.test.getTest.mutate({
    id: params.id,
  });

  return (
    <main>
      <div className="flex min-h-[calc(100vh-48px)] flex-row overscroll-none">
        <div className="flex w-4/5 bg-slate-50 flex-col items-center justify-center">
          <TestAttempt {...test} />
        </div>
        <div className="flex flex-col bg-slate-100 p-4 w-1/5 border-l">
          <p className="text-slate-500 mb-4">
            Instructions
          </p>
          <p className="text-xs text-justify text-slate-500"
            dangerouslySetInnerHTML={{ __html: test.instructions }}
          />  
        </div>
      </div>
    </main>
  );
}
