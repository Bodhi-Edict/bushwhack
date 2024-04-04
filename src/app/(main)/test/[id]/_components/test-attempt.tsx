'use client';
import { useEffect, useState } from 'react';
import { TestInstructionsModal } from './test-instructions-modal';
import { type TestPage } from '~/types/apiResponse.types';
import { PrimaryButton } from '~/app/_components/primary-button';
import { Tooltip } from '~/app/_components/tooltip';
import { api } from '~/trpc/react';
import { QuestionCard } from './question-card';
import { formatTimeSince } from '~/utils/formatTimeSince';
import { QuestionStatus } from '~/types/questionTypes';
import { CarouselSideNav } from './carousel-side-nav';

export function TestAttempt(test: TestPage) {
  const [modalOpen, setModalOpen] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [disableNavigation, setDisableNavigation] = useState(false);

  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [time, setTime] = useState(0);
  // This effect updates the time every second
  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (testStartTime) {
      intervalId = setInterval(() => setTime(time + 1000), 1000);
    }
    return () => clearInterval(intervalId);
  }, [testStartTime, time]);

  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);

  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>(new Array(test.questions.length).fill(QuestionStatus.UNATTEMPTED));
  const [questionWorkings, setQuestionWorkings] = useState<string[]>(new Array(test.questions.length).fill(''));

  // When the modal is closed the test begins
  // This API call creates a test attempt object
  const testAttemptMutation = api.test.createTestAttempt.useMutation({
    onSuccess: (testAttempt) => {
      setTestAttemptId(testAttempt.id);
      setTestStartTime(new Date());
      setModalOpen(false);
    }
  });

  const startTest = () => {
    testAttemptMutation.mutate({ testId: test.id });
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuestionStatus = questionStatus.map((status, index) => {
      if (status == QuestionStatus.CORRECT || status == QuestionStatus.INCORRECT) {
        if (index != currentQuestionIndex) return QuestionStatus.NEED_TO_CHECK;
      }
      return status;
    });
    setQuestionStatus(newQuestionStatus);
    setExplanation(e.target.value);
  }

  const checkQuestionMutation = api.answer.checkQuestion.useMutation({
    onSuccess: (response) => {
      console.log(response);
      const newQuestionStatus = questionStatus.map((status, index) => {
        if (index == currentQuestionIndex) {
          if (response.error) return QuestionStatus.ERROR;
          return response.isCorrect ? QuestionStatus.CORRECT : QuestionStatus.INCORRECT;
        }
        return status;
      });
      const newQuestionWorkings = questionWorkings.map((explanation, index) => {
        if (index == currentQuestionIndex) {
          if (response.error) return response.message;
          return response.working;
        }
        return explanation;
      });
      setQuestionStatus(newQuestionStatus);
      setQuestionWorkings(newQuestionWorkings);
      setDisableNavigation(false);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!testAttemptId) return;
    if(!test.questions[currentQuestionIndex]) return;
    const question = test.questions[currentQuestionIndex]!;
    
    setDisableNavigation(true);
    const newQuestionStatus = questionStatus.map((status, index) => {
      if (index == currentQuestionIndex) {
        return QuestionStatus.LOADING;
      }
      return status;
    });

    const newQuestionWorkings = questionWorkings.map((working, index) => {
      if (index == currentQuestionIndex) {
        return '';
      }
      return working;
    });

    setQuestionStatus(newQuestionStatus);
    setQuestionWorkings(newQuestionWorkings);
    checkQuestionMutation.mutate({
      testAttemptId: testAttemptId,
      questionId: question.id,
      explanationText: explanation,
    });
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <>
      {modalOpen && <TestInstructionsModal {...test} numberOfQuestions={test.questions.length} close={startTest}/>}

      {/* Test Header */}
      <div className="flex p-4 w-full">
        <div className="flex flex-row items-center justify-between gap-4 shadow-md bg-white w-full p-4 rounded-md">
          <span className="text-lg"> {test.name} </span>
          <div className="flex gap-4 flex-row items-center">
            <span className="text-slate-400"> {testStartTime && formatTimeSince(time)} </span>
            <PrimaryButton> Submit Test</PrimaryButton>
          </div>
        </div>
      </div>

      {/* Carousel for questions */}
      <div className="flex flex-row h-3/5 min-w-full items-center justify-center">
        <div className="flex flex-col w-1/3 max-h-[calc(100%-32px)] pl-4">
          <div className="max-h-3/5 overflow-auto flex flex-col pr-8">
            {/* Carousel Navigation */}
            {test.questions.map((question, index) => (
              <CarouselSideNav 
                disabled={disableNavigation}
                onClick={() => setCurrentQuestionIndex(index)}
                isActive={currentQuestionIndex===index}
                id={question.id}
                title={question.title}
                status={questionStatus[index]}
                key={question.id}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row h-full w-2/3 items-center justify-center">
          <button disabled={currentQuestionIndex===0 || disableNavigation} className="text-2xl text-slate-500 font-medium m-4" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>{"<"}</button>
            <QuestionCard 
              title={test.questions[currentQuestionIndex]?.title} 
              number={currentQuestionIndex + 1} 
              status={questionStatus[currentQuestionIndex]}
              message={questionWorkings[currentQuestionIndex]} />
          <button disabled={currentQuestionIndex===test.questions.length - 1 || disableNavigation} className="text-2xl text-slate-500 font-medium m-4" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>{">"}</button>
        </div>
      </div>

      {/* Explanation Form */}
      <form onSubmit={handleSubmit} className="flex flex-col h-2/5 min-w-full items-center justify-center p-4 select-none">
        <textarea 
          name="explanation"
          className="h-full w-full outline outline-slate-200 p-4 mb-2 rounded-md resize-none focus-visible:outline-slate-200 "
          placeholder="Type your explanation here"
          value={explanation}
          disabled={disableNavigation}
          onChange={handleFormChange} 
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
