'use client';
import React, {
  createContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useContext,
  useCallback,
} from 'react';

interface IUnsavedChanges {
  proceedLink?: string;
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
};

const UnsavedChangesContext = createContext<IUnsavedChanges | undefined>(undefined);

export const UnsavedChangesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if(isEnabled) {
        console.log("YOOO", isEnabled)
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEnabled]);

  const context = useMemo((): IUnsavedChanges => ({
    isEnabled,
    setIsEnabled,
  }), [isEnabled, setIsEnabled]);

  return (
    <UnsavedChangesContext.Provider value={context}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export function useSetUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);

  if (context === undefined) {
    throw new Error(
      'useSetUnsavedChanges must be called within <UnsavedChangesProvider />'
    );
  }

  const { setIsEnabled } = context;
  const setUnsavedChanges = useCallback(() => {
    setIsEnabled(true);
  }, [setIsEnabled]);

  const clearUnsavedChanges = useCallback(() => {
    setIsEnabled(false);
  }, [setIsEnabled]);

  return useMemo(() => ({setUnsavedChanges,clearUnsavedChanges}), [setUnsavedChanges, clearUnsavedChanges]);
}
