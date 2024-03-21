import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Navbar } from "./_components/navbar";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const subjects = await api.subject.getAll.query();
  return (
    <main>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <div className="text-center">
            <h1 className="text-4xl mb-2">
              Welcome to the <span className="text-accent-1-500 font-medium">IRA Project</span>
            </h1>
            <h1 className="text-2xl">
              Learn by teaching concepts to an AI study buddy. Select a subject to get started. 
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {
              subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subject/${subject.id}`}
                  className="flex max-w-xs flex-col gap-4 rounded-xl border p-4 hover:border-accent-1-500">
                  <h3 className="text-lg">{subject.name} →</h3>
                  <div className="text">
                    {subject.description}
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </main>
  );
}
