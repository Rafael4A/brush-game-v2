import { useEffect, useRef, useId } from "react";
import { DefaultTheme } from "styled-components";

import { Button } from "../Button";
import { Column } from "../FlexBoxes";

import {
  StyledModal,
  ModalContainer,
  ModalFooter,
  ModalTopBar,
} from "./styles";

export interface Action {
  label: string;
  color?: keyof DefaultTheme["colors"];
  type?: "button" | "close-button";
  disabled?: boolean;
  onClick?: () => void;
}

export type BaseModalProps = {
  id: string;
  title?: string;
  actions: Action[];
  onClose: () => void;
  children: React.ReactNode;
  open: boolean;
};

export function BaseModal({
  id,
  title,
  actions,
  onClose,
  children,
  open,
  ...props
}: Readonly<BaseModalProps>) {
  const componentId = useId();
  const titleId = `${componentId}-title-${id}`;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <StyledModal ref={dialogRef} aria-labelledby={titleId} {...props}>
      {!!title && <ModalTopBar id={titleId}>{title}</ModalTopBar>}

      <ModalContainer>
        <Column>{children}</Column>

        <ModalFooter>
          {actions.map(({ onClick, label, type, color, disabled }) => (
            <Button
              key={label}
              disabled={disabled}
              color={color}
              onClick={() => {
                if (type !== "button") onClose();
                onClick?.();
              }}
            >
              {label}
            </Button>
          ))}
        </ModalFooter>
      </ModalContainer>
    </StyledModal>
  );
}
