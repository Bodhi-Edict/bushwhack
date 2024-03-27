interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode,
  disabled?: boolean,
  onClick?: () => void, 
  isPink?: string,
}

export const PrimaryButton: React.FC<IProps> = ({ children, onClick, disabled=false, isPink=false }) => {
  return <button 
    className={`${isPink ? "bg-accent-1-500" : "bg-accent-2-500"} disabled:opacity-50 min-w-24 rounded-md py-2 px-3 font-normal text-xs flex items-center
     hover:bg-accent-2-600 ${disabled ? 'cursor-not-allowed':'cursor-pointer'}`} 
    onClick={onClick} 
    disabled={disabled}
  >
    <div className="m-auto">
      {children}
    </div>
  </button>
}
