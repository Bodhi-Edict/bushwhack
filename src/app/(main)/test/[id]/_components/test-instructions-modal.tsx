'use client';
import Image from 'next/image';
import { PrimaryButton } from '~/app/_components/primary-button';

interface IProps {
  name: string,
  instructions: string,
  maxTimeInMins: number | null,
  imageUrl: string,
  numberOfQuestions: number,
  close: () => void,
}

export function TestInstructionsModal({ name, instructions, maxTimeInMins, imageUrl, numberOfQuestions, close }: IProps) {
  return (
    <>
    <dialog
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
      <div className="flex flex-col gap-4 bg-white m-auto max-w-2xl p-8 rounded-md">
        <Image
          src={imageUrl}
          alt={name}
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-md mx-auto mb-4 text-center w-full h-auto" />
        <p className="text-2xl">
          {name}
        </p>
        <p className="text-md">
          {numberOfQuestions} QUESTIONS
        </p>
        <p>
          {instructions}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs my-auto text-slate-600 ">
              {maxTimeInMins ? `${maxTimeInMins} MINS` : "NO TIME LIMIT"}
          </span>
          <PrimaryButton onClick={close}>
            Start Test
          </PrimaryButton>
        </div>
     </div>
    </dialog>
    </>
  );
}
