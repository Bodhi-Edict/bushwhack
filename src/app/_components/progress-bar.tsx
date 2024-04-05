interface IProps  {
  progress: number,
  withText?: boolean,
}

export function ProgressBar({ progress, withText }: IProps) {
  return (
    <div className="grid grid-row text-center">
      <div className="flex w-full mx-auto bg-slate-100 rounded-full h-2">
        <div className="flex flex-col bg-accent-3-500 h-2 rounded-full"
          style={
            {
                'width': `${progress ? (progress * 100).toFixed(0) : '1'}%`
            }
          }></div>
      </div>
      { withText && <span className="text-xs mt-2"> {progress ? (progress * 100).toFixed(0) : '0'}% Progress</span>}
    </div>
);
}
