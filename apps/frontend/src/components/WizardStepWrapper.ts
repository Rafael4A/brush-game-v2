import { PropsWithChildren } from "react";

import { useWizard } from "../context";

interface WizardStepWrapperProps {
  index: number;
}

export function WizardStepWrapper({
  children,
  index,
}: PropsWithChildren<WizardStepWrapperProps>) {
  const { activeStep } = useWizard();

  if (activeStep === index) return children;

  return null;
}
