import { HTMLProps, forwardRef } from "react";

import { UnstyledButton } from "..";

import { mdiWindowClose } from "@mdi/js";
import Icon from "@mdi/react";
import { useTheme } from "styled-components";

import { StyledModal } from "./styles";

interface StyledModalWithCloseButtonProps extends HTMLProps<HTMLDialogElement> {
  dismissFn: () => void;
}

export const StyledModalWithCloseButton = forwardRef<
  HTMLDialogElement,
  StyledModalWithCloseButtonProps
>(function StyledModalWithCloseButton({ dismissFn, children, ...props }, ref) {
  const { colors } = useTheme();
  return (
    <StyledModal {...props} ref={ref}>
      <UnstyledButton
        style={{ position: "absolute", right: 8, top: 4 }}
        onClick={dismissFn}
      >
        <Icon path={mdiWindowClose} size={1.2} color={colors.lightRed} />
      </UnstyledButton>
      {children}
    </StyledModal>
  );
});
