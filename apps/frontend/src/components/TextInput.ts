import styled from "styled-components";

export const TextInput = styled.input.attrs({ type: "text" })(({ theme }) => ({
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "0",
  borderBottom: `2px solid ${theme.colors.light_gray}`,

  padding: "4px 0 2px",
  width: "100%",
  "&:focus": {
    outline: "none",
    borderBottom: `2px solid ${theme.colors.yellow}`,
  },
}));
