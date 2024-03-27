import Link from "next/link";
import { BackButton } from "~/app/_components/back-button";
import { PrimaryButton } from "~/app/_components/primary-button";
import { api } from "~/trpc/server";
import Image from "next/image";
import { ProgressBar } from "~/app/_components/progress-bar";

export default async function Subject({ params }: { params: { slug: string } }) {
  const subject = await api.subject.getSubject.mutate({
    slug: params.slug,
  });
  return (
    <main>
      <BackButton />
      <div className="flex min-h-[calc(100%-12px)] flex-col items-center justify-center p-12">
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <div className="text-center w-3/4">
            <p className="text-4xl mb-2 text-accent-1-500 font-medium">
              {subject.name}
            </p>
            <p className="text-xl">
              {subject.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-3/4">
            {
              subject.tests?.map((test) => (
                <div key={test.id} className="grid grid-rows gap-4 mb-2 border p-4 rounded-md">
                  <Image
                    src={test.imageUrl}
                    alt={test.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-md mx-auto mb-4 text-center w-full h-auto" />
                  <p className="text-2xl">
                    {test.name}
                  </p>
                  {Number(test.progress) > 0 && <ProgressBar progress={Number(test.progress)}/>}
                  <div className="flex justify-between items-center">
                    <span className="text-xs my-auto text-slate-600 ">
                        {test.maxTimeInMins ? `${test.maxTimeInMins} MINS` : "NO TIME LIMIT"}
                    </span>
                    <Link
                      href={`/test/${test.id}`}>
                        <PrimaryButton>
                          {Number(test.progress) > 0 ? "Try Again" : "Start Test"}
                        </PrimaryButton>
                    </Link>
                  </div>
                </div>
              ))
            }
            {
              subject.tests?.map((test) => (
              <div key={test.id} className="grid grid-rows gap-4 mb-2 border p-4 rounded-md">
                <Image
                  src="https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/math-tests/Arithmetic+Progression.webp"
                  alt={test.name}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="rounded-md mx-auto mb-4 text-center w-full h-auto" />
                <p className="text-2xl">
                  Arithmetic Progression
                </p>
                {Number(50) > 0 && <ProgressBar progress={Number(0.5)}/>}
                <div className="flex justify-between items-center">
                  <span className="text-xs my-auto text-slate-600 ">
                      60 MINS
                  </span>
                  <Link
                    href={`/test/${test.id}`}>
                      <PrimaryButton>
                        {Number(50) > 0 ? "Try Again" : "Start Test"}
                      </PrimaryButton>
                  </Link>
                </div>
              </div>
              ))
            }
          </div>
        </div>
      </div>
    </main>
  );
}
