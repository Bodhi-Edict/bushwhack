'use client';

import { QuestionStatus } from "~/types/questionTypes";

interface IProps  {
  disabled?: boolean,
  onClick: () => void,
  isActive?: boolean,
  id: string,
  title: string
  status?: QuestionStatus
}

export function CarouselSideNav({ disabled=false, onClick, isActive=false, id, title, status=QuestionStatus.UNATTEMPTED }: IProps) {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={`bg-white mb-2 rounded-md min-h-32 border-2 relative ${isActive ? 'border-accent-1-200' : ''}`}
      key={id}>
        <div className='text-sm p-4'>
          <div className="line-clamp-2">
            {title}
          </div>
        </div>
        <div className="absolute right-2 top-2">
          {
            status === QuestionStatus.CORRECT &&
            <p className="text-md"> ✅ </p>
          }
          {
            status === QuestionStatus.INCORRECT &&
            <p className="text-md"> ❌ </p>
          }
          {
            status === QuestionStatus.LOADING &&
            <p className="text-md"> ⌛ </p>
          }
          {
            status === QuestionStatus.NEED_TO_CHECK &&
            <p className="text-md"> ❔ </p>
          }
          {
            status === QuestionStatus.ERROR &&
            <p className="text-md"> ❗ </p>
          }
        </div>
    </button>
  );
}