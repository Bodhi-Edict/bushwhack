'use client';
import { Tooltip } from "~/app/_components/tooltip";
import { QuestionStatus } from "~/types/question.types";

interface IProps  {
  title?: string,
  number: number
  status?: QuestionStatus,
  message?: string,

}

export function QuestionCard({ title, number, status, message }: IProps) {
  return (
    <div className="h-[calc(100%-32px)] w-full my-4 flex flex-col bg-white shadow-md">
      <div className="text-center w-full p-8 bg-accent-2-200 m-auto min-h-32 max-h-40 overflow-y-scroll"> 
        <span className="font-bold"> Question: {number} </span>
        {title} 
      </div>
      <div className="text-center w-full p-8 h-3/4 overflow-y-scroll">
        {
          status === QuestionStatus.CORRECT &&
          <>
            <p className="text-lg"> 🎉 Correct! </p>
            <br />
            <p className="overflow-y-scroll max-h-calc[100%-96px]"> {message} </p>
          </>
        }
        {
          status === QuestionStatus.INCORRECT &&
          <>
            <p className="text-lg"> 📝 Whoops! Try Again </p>
            <br />
            <p className="overflow-y-scroll max-h-calc[75%-96px]"> {message} </p>
          </>
        }
        {
          status === QuestionStatus.LOADING &&
          <div>
            Loading...
          </div>
        }
        {
          status === QuestionStatus.NEED_TO_CHECK &&
          <div>
            <Tooltip 
              message="Your explanation may have changed since you last submitted"
              width="100%">
              <p> ✋🏾 Need to check </p>
            </Tooltip>
            <br />
            <p className="overflow-y-scroll max-h-calc[75%-96px]"> {message} </p>
          </div>
        }
        {
          status === QuestionStatus.ERROR &&
          <div>
            <p className="text-lg"> ❗ Error </p>
            <br />
            <p> {message} </p>
          </div>
        }
      </div>
    </div>
  );
}
