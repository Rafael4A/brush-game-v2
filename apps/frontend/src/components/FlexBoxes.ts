import styled from "styled-components";

interface IFlexBoxProps {
  gap?: string;
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse" | boolean;
  alignSelf?:
    | "auto"
    | "stretch"
    | "center"
    | "flex-start"
    | "flex-end"
    | "baseline"
    | "initial"
    | "inherit";
  width?: string;
  height?: string;
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  fullWidth?: boolean;
}

const FlexBox = styled.div<IFlexBoxProps>(
  ({
    gap,
    alignItems,
    justifyContent,
    flexWrap,
    alignSelf,
    width,
    height,
    padding,
    paddingX,
    paddingY,
    fullWidth,
  }) => ({
    display: "flex",
    alignItems: alignItems ?? "center",
    justifyContent: justifyContent ?? "center",
    ...(gap && { gap }),
    ...(width && { width }),
    ...(fullWidth && { width: "100%" }),
    ...(height && { height }),
    ...(flexWrap && {
      flexWrap: typeof flexWrap === "boolean" ? "wrap" : flexWrap,
    }),
    ...(alignSelf && { alignSelf }),
    ...(paddingX && { paddingLeft: paddingX, paddingRight: paddingX }),
    ...(paddingY && { paddingTop: paddingY, paddingBottom: paddingY }),
    ...(padding && { padding }),
  })
);

export const Row = FlexBox;

export const Column = styled(FlexBox)({
  flexDirection: "column",
});
