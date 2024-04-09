import Image from 'next/image';
import { PrimaryButton } from '~/app/_components/primary-button';

interface IProps {
  explanation: string,
  progress: number,
  imageUrl: string,
  testName: string,
  close: () => void,

}

export function TestSubmissionModal({ explanation, progress, imageUrl, testName, close }: IProps) {

  return (
    <>
    <dialog
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
      <div className="flex flex-col gap-4 bg-white m-auto max-w-2xl p-8 rounded-md">
        <Image
          src={imageUrl}
          alt={testName}
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-md mx-auto mb-4 text-center w-full h-auto" />
        <p className="text-xl">
          Congratulations! You have successfully completed the test.
        </p>
        <div>
          <div className="flex justify-between flex-col gap-4">
            <p> You explaned {testName} as follows: </p>
            <p> {explanation} </p>
            <p>
              Based on your explanation your study buddy was able to answer {(progress * 100).toFixed(2)}% of the questions.
            </p>
          </div>
        </div>
        <PrimaryButton onClick={close}>
          View Explanations
        </PrimaryButton>
     </div>
    </dialog>
    </>
  );
}
