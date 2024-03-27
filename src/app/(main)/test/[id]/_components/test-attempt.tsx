'use client';
import { useEffect, useState } from 'react';
import { TestInstructionsModal } from './test-instructions-modal';
import { type TestPage } from '~/apiResponseTypes';
import { PrimaryButton } from '~/app/_components/primary-button';
import { Tooltip } from '~/app/_components/tooltip';
import { api } from '~/trpc/react';

enum QuestionStatus {
  UNATTEMPTED,
  NEED_TO_CHECK,
  CORRECT,
  INCORRECT,
}

const calculateTimeSince = (time: number) => {
  const minutes = Math.floor(time / 60000); 
  const seconds = Math.floor((time % 60000) / 1000); 
  
  // Format the minutes and seconds with leading zeros if needed
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
}

export function TestAttempt(test: TestPage) {
  const [modalOpen, setModalOpen] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [disableNavigation, setDisableNavigation] = useState(false);

  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [time, setTime] = useState(0);
  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);

  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>(new Array(test.questions.length).fill(QuestionStatus.UNATTEMPTED));
  const [questionExplanations, setQuestionExplanations] = useState<string[]>(new Array(test.questions.length).fill(''));

  const testAttemptMutation = api.test.createTestAttempt.useMutation({
    onSuccess: (testAttempt) => {
      setTestAttemptId(testAttempt.id);
      setTestStartTime(new Date());
      setModalOpen(false);
    }
  });

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (testStartTime) {
      intervalId = setInterval(() => setTime(time + 1000), 1000);
    }
    return () => clearInterval(intervalId);
  }, [testStartTime, time]);

  const startTest = () => {
    testAttemptMutation.mutate({ testId: test.id });
  }

  const handleSubmit = () => {
    console.log("BROOO")
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <>
      {modalOpen && <TestInstructionsModal {...test} numberOfQuestions={test.questions.length} close={startTest}/>}
      <div className="flex p-4 w-full">
        <div className="flex flex-row items-center justify-between gap-4 shadow-md bg-white w-full p-4 rounded-md">
          <span> {test.name} </span>
          <div className="flex gap-4 flex-row items-center">
            <span className="text-slate-400"> {testStartTime && calculateTimeSince(time)} </span>
            <PrimaryButton> Submit Test</PrimaryButton>
          </div>
        </div>
      </div>
      <div className="flex flex-row h-1/2 min-w-full items-center justify-center">
        <div className="flex flex-col w-1/3 max-h-[calc(100%-32px)] pl-4">
          <div className="max-h-3/5 overflow-auto flex flex-col pr-8">
            {test.questions.map((question, index) => (
              <button 
                disabled={disableNavigation}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`bg-white mb-2 rounded-md min-h-32 p-4 border-2 ${currentQuestionIndex===index ? 'border-accent-1-200' : ''}`}
                key={question.id}>
                  <span className='text-sm line-clamp-3'>
                    {question.title}
                  </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-row h-full w-2/3 items-center justify-center">
          <button disabled={currentQuestionIndex===0 || disableNavigation} className="text-2xl text-slate-500 font-medium m-4" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>{"<"}</button>
          <div className="h-[calc(100%-32px)] w-full my-4 flex flex-col bg-white shadow-md">
            <div className="text-center w-full p-8 bg-accent-2-200 min-h-32 m-auto"> 
              <span className="font-bold"> Question {currentQuestionIndex + 1}: </span>
              {test.questions[currentQuestionIndex]?.title} 
            </div>
            <div className="text-center w-full p-8 h-3/4">

            </div>
          </div>
          <button disabled={currentQuestionIndex===test.questions.length - 1 || disableNavigation} className="text-2xl text-slate-500 font-medium m-4" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>{">"}</button>
        </div>
        
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col h-1/2 min-w-full items-center justify-center p-4">
        <textarea 
          className="h-full w-full outline outline-slate-200 p-4 mb-2 rounded-md resize-none focus-visible:outline-slate-200"
          placeholder="Type your explanation here"
          value={explanation} 
          onChange={(e) => setExplanation(e.target.value)} 
          maxLength={test.maxLength ? test.maxLength : undefined}/>
        <div className="px-2 flex justify-between items-center w-full">
          <p className="text-sm text-slate-500">
            {explanation.length} {test.maxLength ? `/ ${test.maxLength}` : ''} characters
          </p>
          <div className="flex flex-row gap-2">
            <PrimaryButton>Compute</PrimaryButton>
            <Tooltip message="Unfortunately it costs a lot of money to compute all questions every time you make a change. Reach out to us at vig9295@gmail.com if you need this feature.">
              <PrimaryButton disabled>Compute All</PrimaryButton>
            </Tooltip>
          </div>
        </div>
      </form>
    </>
  );
}
