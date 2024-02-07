import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export interface WizardContext {
  next: () => void;
  previous: () => void;
  to: (index: number) => void;
  activeStep: number;
  stepsCount: number;
  progress: number;
}

interface WizardProviderProps {
  initialActiveStep?: number;
  stepsCount: number;
}

const WizardContext = createContext<WizardContext>({} as WizardContext);

export function useWizard(): WizardContext {
  return useContext(WizardContext);
}

export function WizardProvider({
  children,
  initialActiveStep = 0,
  stepsCount,
}: PropsWithChildren<WizardProviderProps>) {
  const [activeStep, setActiveStep] = useState(initialActiveStep);

  const next = () => setActiveStep((current) => current + 1);

  const previous = () => setActiveStep((current) => current - 1);

  const to = (index: number) => setActiveStep(index);

  const progress = useMemo(
    () => 100 * ((activeStep + 1) / stepsCount),
    [activeStep, stepsCount]
  );

  const contextValue = useMemo(
    () => ({
      to,
      progress,
      stepsCount,
      activeStep,
      previous,
      next,
    }),
    [to, progress, stepsCount, activeStep, previous, next]
  );

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
}

export interface WizardStep {
  index: number;
  title?: string;
  component: React.ReactNode;
}
