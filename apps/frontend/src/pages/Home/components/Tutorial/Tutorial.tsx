import { useEffect, useId, useRef } from "react";

import {
  Button,
  ModalContainer,
  ModalFooter,
  ModalTopBar,
  ProgressBar,
  StyledModalWithCloseButton,
  WizardStepWrapper,
} from "../../../../components";
import { WizardProvider, WizardStep, useWizard } from "../../../../context";
import {
  DrawingCardsStep,
  GameEndStep,
  GameSetupStep,
  GameplayOverviewStep,
  InitialSetupStep,
  IntroductionStep,
  OnlineGameStep,
  ScoringStep,
} from "./steps";
import { useTutorial } from "./TutorialContext";

const steps: WizardStep[] = Array.from(
  [
    {
      title: "Introduction",
      component: <IntroductionStep />,
    },
    {
      title: "Initial Setup",
      component: <InitialSetupStep />,
    },
    {
      title: "Drawing Cards",
      component: <DrawingCardsStep />,
    },
    {
      title: "Gameplay Overview",
      component: <GameplayOverviewStep />,
    },
    {
      title: "Game Setup",
      component: <GameSetupStep />,
    },
    {
      title: "Scoring",
      component: <ScoringStep />,
    },
    {
      title: "Game End",
      component: <GameEndStep />,
    },
    {
      title: "Online Game",
      component: <OnlineGameStep />,
    },
  ],
  (value, index) => ({ ...value, index })
);

interface TutorialInnerProps {
  titleId: string;
}

function TutorialInner({ titleId }: Readonly<TutorialInnerProps>) {
  const { next, previous, progress, activeStep, to } = useWizard();
  const { close, isOpen } = useTutorial();
  const formattedProgress = progress.toFixed(2);

  useEffect(() => {
    if (!isOpen) to(0);
  }, [isOpen, to]);

  const hasReachedEnd = activeStep === steps.length - 1;

  return (
    <ModalContainer style={{ textAlign: "center" }}>
      {steps.map(({ component, index, title }) => (
        <WizardStepWrapper index={index} key={index}>
          {<ModalTopBar id={titleId}>{title}</ModalTopBar>}
          {component}
        </WizardStepWrapper>
      ))}

      <ProgressBar id="tutorial-progress" max="100" value={formattedProgress}>
        {formattedProgress}%
      </ProgressBar>
      <ModalFooter>
        {activeStep > 0 && (
          <Button disabled={activeStep <= 0} onClick={previous}>
            Previous
          </Button>
        )}
        <Button onClick={hasReachedEnd ? close : next}>
          {hasReachedEnd ? "Finish!" : "Next"}
        </Button>
      </ModalFooter>
    </ModalContainer>
  );
}

export function Tutorial() {
  const { close, isOpen } = useTutorial();
  const componentId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <WizardProvider initialActiveStep={0} stepsCount={steps.length}>
      <StyledModalWithCloseButton
        ref={dialogRef}
        aria-labelledby={componentId}
        dismissFn={close}
      >
        <TutorialInner titleId={componentId} />
      </StyledModalWithCloseButton>
    </WizardProvider>
  );
}
