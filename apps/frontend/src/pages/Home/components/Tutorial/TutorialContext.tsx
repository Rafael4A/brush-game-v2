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

// eslint-disable-next-line react-refresh/only-export-components
export function useTutorial(): TutorialContext {
  return useContext(TutorialContext);
}

export function TutorialProvider({ children }: Readonly<PropsWithChildren>) {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isOpen,
    }),
    [isOpen]
  );

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
}
