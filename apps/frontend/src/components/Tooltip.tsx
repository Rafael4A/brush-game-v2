import styled from "styled-components";

export const HoverTooltip = styled.span({
  position: "relative",
  display: "flex",
  "& > span": {
    visibility: "hidden",
    width: "120px",
    backgroundColor: "black",
    color: "#fff",
    textAlign: "center",
    padding: "0.25rem 0.25rem",
    borderRadius: "6px",
    position: "absolute",
    zIndex: 1,
    top: "100%",
    left: "50%",
    marginLeft: "-60px",
    opacity: 0,
    transition: "opacity 0.3s",
  },
  "&:hover > span": {
    visibility: "visible",
    opacity: 1,
  },
  "& > span::after ": {
    content: '""',
    position: "absolute",
    bottom: "100%",
    left: "50%",
    marginLeft: "-5px",
    borderWidth: "5px",
    borderStyle: "solid",
    borderColor: "transparent transparent black transparent",
  },
});

interface StyledTooltipProps {
  visible: boolean;
  direction?: "top" | "bottom";
  width?: string;
}

const StyledTooltip = styled.span<StyledTooltipProps>(
  ({ visible, width, direction = "bottom" }) => ({
    position: "relative",
    display: "flex",
    "& > span": {
      visibility: visible ? "visible" : "hidden",
      width: width ?? "120px",
      backgroundColor: "black",
      color: "#fff",
      textAlign: "center",
      padding: "0.25rem 0.25rem",
      borderRadius: "6px",
      position: "absolute",
      zIndex: 1,
      ...(direction === "bottom" && { top: "100%" }),
      ...(direction === "top" && { bottom: "100%" }),
      left: "50%",
      marginLeft: width ? `calc(${width} / -2)` : "-60px",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s",
    },
    "& > span::after ": {
      content: '""',
      position: "absolute",
      ...(direction === "top" && { top: "100%" }),
      ...(direction === "bottom" && { bottom: "100%" }),
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: "transparent transparent black transparent",
      ...(direction === "top" && {
        borderColor: "black transparent transparent transparent",
      }),
      ...(direction === "bottom" && {
        borderColor: "transparent transparent black transparent",
      }),
    },
  })
);

interface TooltipProps extends StyledTooltipProps {
  text: string;
}

export function Tooltip({ text, ...props }: TooltipProps) {
  return (
    <StyledTooltip {...props}>
      <span>{text}</span>
    </StyledTooltip>
  );
}
