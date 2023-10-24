import styled from "styled-components";

interface ButtonProps {
  fullWidth?: boolean;
  color?: string;
}

export const Button = styled.button<ButtonProps>(
  ({ theme, fullWidth, color }) => ({
    backgroundColor: color ?? theme.colors.main_gray,
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    width: fullWidth ? "100%" : "auto",
    "&:disabled": {
      backgroundColor: theme.colors.lightest_gray,
      cursor: "not-allowed",
    },
  })
);
