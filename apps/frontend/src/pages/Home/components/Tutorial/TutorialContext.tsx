import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export interface TutorialContext {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const TutorialContext = createContext<TutorialContext>({} as TutorialContext);

export function useTutorial(): TutorialContext {
  return useContext(TutorialContext);
}

export function TutorialProvider({ children }: Readonly<PropsWithChildren>) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const contextValue = useMemo(
    () => ({
      open,
      close,
      isOpen,
    }),
    [open, close, isOpen]
  );

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
}
