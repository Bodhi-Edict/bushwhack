'use client';
import { useEffect, useReducer, useState } from 'react';
import { TestInstructionsModal } from './test-instructions-modal';
import { type TestPage } from '~/types/apiResponse.types';
import { PrimaryButton } from '~/app/_components/primary-button';
import { Tooltip } from '~/app/_components/tooltip';
import { api } from '~/trpc/react';
import { QuestionCard } from './question-card';
import { formatTimeSince } from '~/utils/formatTimeSince';
import { QuestionStatus } from '~/types/questionTypes';
import { CarouselSideNav } from './carousel-side-nav';
import { ProgressBar } from '~/app/_components/progress-bar';
import { TestSubmissionModal } from './test-submission-modal';
import { ActionType, testAttemptReducer } from './test-attempt_reducer';
import { useRouter } from 'next/navigation';

export function TestAttempt(test: TestPage) {
  const router = useRouter();
  
  // This state is used to prevent users from submitting the test without attempting even one question
  const [computeOnce, setComputeOnce] = useState(false)

  // The modal states control the visibility of the instructions and submission modals
  const [modalOpen, setModalOpen] = useState(true);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  // Explanation controls the text in the explanation textarea
  const [explanation, setExplanation] = useState('');

  // This state is used to control the navigation of the questions
  // The navigation is disabled when a question is computing
  const [disableNavigation, setDisableNavigation] = useState(false);

  // This state is used to control the submission of the test
  // When the test is submitted the user can only view the results but not act
  const [testSubmit, setTestSubmit] = useState(false);

  // This state is used to keep track of the time since the test started
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [time, setTime] = useState(0);

  // This state is used to keep track of the test attempt id
  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);

  // This state is used to keep track of the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // This effect updates the time every second
  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (testStartTime && !testSubmit) {
      intervalId = setInterval(() => setTime(time + 1000), 1000);
    }
    return () => clearInterval(intervalId);
  }, [testStartTime, time, testSubmit]);

  // This state is used to keep track of the status of the questions
  // It is managed by a reducer
  const [testAttemptState, testAttemptStateDispatch] = useReducer(
    testAttemptReducer, 
    test.questions.map((question) => ({
      id: question.id,
      status: QuestionStatus.UNATTEMPTED,
      working: '',
    }))
  );

  const numberCorrect = testAttemptState.filter(question => question.status == QuestionStatus.CORRECT).length;

  // When the modal is closed the test begins
  // This API call creates a test attempt object
  const testAttemptMutation = api.test.createTestAttempt.useMutation({
    onSuccess: (testAttempt) => {
      setTestAttemptId(testAttempt.id);
      setTestStartTime(new Date());
      setModalOpen(false);
    }
  });

  // Call the test attempt mutation when start test button is clicked
  const startTest = () => {
    testAttemptMutation.mutate({ testId: test.id });
  }

  // This function is called when the explanation textarea is changed
  // It ensures that the question status is set to NEED_TO_CHECK and users know to test those questions again.
  const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExplanation = e.target.value;
    for (const question of testAttemptState) {
      if (question.status == QuestionStatus.CORRECT || question.status == QuestionStatus.INCORRECT || question.status == QuestionStatus.ERROR) {
        testAttemptStateDispatch({
          type: ActionType.UpdateQuestion,
          payload: {
            questionId: question.id,
            newStatus: QuestionStatus.NEED_TO_CHECK,
            working: question.working,
          }
        });
      }
    };
    setExplanation(newExplanation);
  }

  // This function calls the check Question API and updates the question status and workings
  const checkQuestionMutation = api.answer.checkQuestion.useMutation({
    onSuccess: (response) => {
      testAttemptStateDispatch({
        type: ActionType.UpdateQuestion,
        payload: {
          questionId: response.questionId,
          newStatus: response.error ? QuestionStatus.ERROR : response.isCorrect ? QuestionStatus.CORRECT : QuestionStatus.INCORRECT,
          working: response.error ? response.message : response.working,
        }
      });
      setComputeOnce(true);
      setDisableNavigation(false);
    },
    onError: (error) => {
      setDisableNavigation(false);
      console.log(error);
      alert(error.message)
    }
  });

  // This function handles the submission of a single question
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!testAttemptId) return;
    if(!test.questions[currentQuestionIndex]) return;
    const question = test.questions[currentQuestionIndex]!;

    testAttemptStateDispatch({
      type: ActionType.UpdateQuestion,
      payload: {
        questionId: question.id,
        newStatus: QuestionStatus.LOADING,
        working: '',
      }
    })

    checkQuestionMutation.mutate({
      testAttemptId: testAttemptId,
      questionId: question.id,
      explanationText: explanation,
    });
    setDisableNavigation(true);
  }

  // This function calls the submit test API and opens the submission modal
  const submitTestMutation = api.answer.submitTest.useMutation({
    onSuccess: () => {
      setSubmissionModalOpen(true);
    }
  });

  // This function handles the submission of the entire test
  const handleSubmitTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!testAttemptId) return;
    setDisableNavigation(true);
    setTestSubmit(true);
    const promises = []
    for (const question of testAttemptState) {
      if (question.status == QuestionStatus.CORRECT || question.status == QuestionStatus.INCORRECT) continue;
      testAttemptStateDispatch({
        type: ActionType.UpdateQuestion,
        payload: {
          questionId: question.id,
          newStatus: QuestionStatus.LOADING,
          working: '',
        }
      })
      promises.push(checkQuestionMutation.mutateAsync({
        testAttemptId: testAttemptId,
        questionId: question.id,
        explanationText: explanation,
      }));
    }

    void Promise.all(promises).then(() => {
      submitTestMutation.mutate({
        testAttemptId: testAttemptId,
        explanationText: explanation,
        numberCorrect: numberCorrect,
      });
    });
  }

  // This function exits the test
  const exitTest = () => {
    router.back();
  }


  return (
    <>
      {/* Modals */}
      {modalOpen && <TestInstructionsModal {...test} numberOfQuestions={test.questions.length} close={startTest}/>}
      {submissionModalOpen && 
        <TestSubmissionModal
          explanation={explanation}
          imageUrl={test.imageUrl}
          testName={test.name}
          progress={numberCorrect / test.questions.length}
          close={() => setSubmissionModalOpen(false)}/>}

      {/* Test Header */}
      <div className="flex p-4 w-full">
        <div className="flex flex-row items-center justify-between gap-4 shadow-md bg-white w-full p-4 rounded-md">
          <span className="text-lg"> {test.name} </span>
          <div className="flex flex-row gap-6 items-center">
            <span className="flex flex-row gap-2 items-center">
              Progress: 
              <span className="min-w-48">
                <ProgressBar progress={numberCorrect / test.questions.length} />
              </span>
            </span>
            <span className="text-slate-400"> {testStartTime && formatTimeSince(time)} </span>
            {
              testSubmit
              ?
              <PrimaryButton onClick={exitTest}> Exit Test</PrimaryButton>
              :
              <form onSubmit={handleSubmitTest}>
                <Tooltip 
                  width="250%"
                  message={
                  computeOnce 
                  ? "Remember once you submit you can't go back and change your answers."
                  : "You must compute at least once before submitting your test."}>
                  <PrimaryButton disabled={!computeOnce} type='submit'> Submit Test</PrimaryButton>
                </Tooltip>
              </form>
            }
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
                status={testAttemptState[index]?.status}
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
              status={testAttemptState[currentQuestionIndex]?.status}
              message={testAttemptState[currentQuestionIndex]?.working} />
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
          disabled={disableNavigation || testSubmit}
          onChange={handleFormChange} 
          maxLength={test.maxLength ? test.maxLength : undefined}/>
        <div className="px-2 flex justify-between items-center w-full">
          <p className="text-sm text-slate-500">
            {explanation.length} {test.maxLength ? `/ ${test.maxLength}` : ''} characters
          </p>
          <div className="flex flex-row gap-2">
            <PrimaryButton disabled={testSubmit} >Compute</PrimaryButton>
            <Tooltip message="Unfortunately it costs a lot of money to compute all questions every time you make a change. Reach out to us at vig9295@gmail.com if you need this feature.">
              <PrimaryButton disabled>Compute All</PrimaryButton>
            </Tooltip>
          </div>
        </div>
      </form>
    </>
  );
}
