import styled from "styled-components";

export const ProgressBar = styled.progress(({ theme }) => ({
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  borderRadius: "4px",
  width: "100%",
  height: "8px",
  border: "none",

  "&::-moz-progress-bar": {
    backgroundColor: theme.colors.blue,
    borderRadius: "4px",
  },
  "&::-webkit-progress-value": {
    backgroundColor: theme.colors.blue,
    borderRadius: "4px",
  },
}));
