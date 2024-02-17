import styled from "styled-components";

import { Loader } from "./Loader";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  fullWidth?: boolean;
  color?: string;
}

export const Button = styled.button<ButtonProps>(
  ({ theme, fullWidth, color }) => ({
    backgroundColor: color ?? theme.colors.main.altBackground,
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    width: fullWidth ? "100%" : "auto",
    "&:disabled": {
      backgroundColor: theme.colors.main.disabled,
      cursor: "not-allowed",
    },
  })
);

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  largeFont?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading,
  disabled,
  largeFont,
  ...props
}: Readonly<LoadingButtonProps>) {
  return (
    <Button
      {...props}
      disabled={isLoading || disabled}
      style={{ ...props.style, fontSize: largeFont ? "1.5rem" : "inherit" }}
    >
      {isLoading ? (
        <Loader size={largeFont ? "40px" : "30px"} />
      ) : (
        props.children
      )}
    </Button>
  );
}
