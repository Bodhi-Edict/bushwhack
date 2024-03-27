'use client';
import { useState } from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode,
  message: string,
}

export const Tooltip: React.FC<IProps> = ({ children, message }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col items-center group">
      <span className="flex justify-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        {children}
      </span>
      <div className={`absolute whitespace bottom-full flex flex-col items-center group-hover:flex ${!show ? "hidden" : null}`}>
        <span className="relative z-10 p-2 text-xs w-[150%] text-white bg-gray-600 shadow-lg rounded-md">
          {message}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-600" />
      </div>
    </div>
  );
};