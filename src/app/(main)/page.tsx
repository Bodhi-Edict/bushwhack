import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/server";

export default async function Home() {
  const subjects = await api.subject.getAll.query();
  return (
    <main>
      <div className="flex min-h-[calc(100%-48px)] flex-col items-center justify-center p-12">
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <div className="text-center">
            <p className="text-4xl mb-2">
              Welcome to the <span className="text-accent-1-500 font-medium">Ira Project</span>
            </p>
            <p className="text-2xl">
              Learn by teaching concepts to an AI study buddy. Select a subject to get started. 
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {
              subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subject/${subject.slug}`}
                  className="flex max-w-xs flex-col gap-4 rounded-xl border p-4 hover:border-accent-1-500">
                  <div className="flex flex-row gap-4">
                    <Image className="rounded-full"
                        loading="lazy"
                        src={subject.iconUrl}
                        alt={subject.name ?? ""}
                        width={24}
                        height={24} 
                    />
                    <p className="text-lg">{subject.name} →</p>
                  </div>
                  <p className="text">
                    {subject.description}
                  </p>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </main>
  );
}
