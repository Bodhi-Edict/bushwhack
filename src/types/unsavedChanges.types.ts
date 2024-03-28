import { type Dispatch, type SetStateAction } from 'react';

export interface IUnsavedChanges {
  proceedLink?: string;
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
};