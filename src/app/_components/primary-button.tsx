interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<IProps> = ({ children }) => {
  return <button className="bg-accent-2-500 rounded-md py-2 px-3 font-normal text-xs flex 
    gap-1.5 hover:bg-accent-2-600 cursor-pointer"
  >
      {children}
  </button>
}
