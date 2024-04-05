'use client';
import Image from 'next/image';
import { useState } from 'react';
import { PrimaryButton } from '~/app/_components/primary-button';

interface IProps {
  explanation: string,
  numberOfQuestions: number,
  testAttemptId: string,
  imageUrl: string,
  testName: string
}

export function TestSubmissionModal({ explanation, numberOfQuestions, testAttemptId, imageUrl, testName }: IProps) {

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // This API call submits the test attempt
  
  


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
        <p className="text-2xl">
          {testName}
        </p>
        {
          loading ?
          <p className="text-md">
            Submitting your test...
          </p> :
          <div>
            <div className="flex justify-between items-center">
              <p>
                Congratulations on completing the test!
                Based on your explanation your study buddy was able to answer {progress}% of the questions.
              </p>
            </div>
          </div>
        }
     </div>
    </dialog>
    </>
  );
}
