import styled from "styled-components";

interface SwitchProps {
  onToggle: (isChecked: boolean) => void;
  isChecked: boolean;
  id: string;
}

export function Switch({ onToggle, isChecked, id }: Readonly<SwitchProps>) {
  return (
    <SwitchContainer className="switch">
      <StyledInput
        type="checkbox"
        id={id}
        onChange={({ target }) => onToggle(target.checked)}
        checked={isChecked}
      />
      <StyledSlider className="slider round" isChecked={isChecked} />
    </SwitchContainer>
  );
}

const SwitchContainer = styled.label({
  position: "relative",
  display: "inline-block",
  minWidth: "60px",
  maxWidth: "60px",
  height: "34px",
});

const StyledInput = styled.input({
  opacity: 0,
  width: 0,
  height: 0,
  "&:focus + .slider": {
    boxShadow: "0 0 1px #2196F3",
  },
});

const StyledSlider = styled.span<{ isChecked: boolean }>(({ isChecked }) => ({
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#ccc",
  WebkitTransition: ".2s",
  transition: ".2s",
  borderRadius: "34px",

  "&:before": {
    position: "absolute",
    content: '""',
    height: "26px",
    width: "26px",
    left: "4px",
    bottom: "4px",
    backgroundColor: "white",
    WebkitTransition: ".2s",
    transition: ".2s",
    borderRadius: "50%",
    ...(isChecked && {
      WebkitTransform: "translateX(26px)",
      MsTransform: "translateX(26px)",
      transform: "translateX(26px)",
    }),
  },

  ...(isChecked && { backgroundColor: "#2196F3" }),
}));
