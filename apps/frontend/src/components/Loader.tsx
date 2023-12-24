import styled, { StyledObject } from "styled-components";

const LoaderSpinner = styled.div(
  ({ theme }) =>
    ({
      borderColor: theme.colors.light_gray,
      borderStyle: "solid",
      borderLeftColor: theme.colors.light_blue,
      borderRadius: "50%",
      margin: "0 auto",
      transform: "rotate(45deg)",
      animation: "rotation 0.75s infinite",

      "@keyframes rotation": {
        from: {
          transform: "rotate(45deg)",
        },
        to: {
          transform: "rotate(405deg)",
        },
      },
    }) as StyledObject
);

interface ILoaderContainerProps {
  absolute?: boolean;
}

const LoaderContainer = styled.div<ILoaderContainerProps>(
  ({ absolute }) =>
    absolute && {
      position: "absolute",
      transform: "translate(-50%, -50%)",
      top: "50%",
      left: "50%",
    }
);

interface ILoaderProps {
  size?: number;
  absolute?: boolean;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  loaderProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function Loader({
  size = 60,
  absolute = false,
  containerProps,
  loaderProps,
}: Readonly<ILoaderProps>) {
  return (
    <LoaderContainer absolute={absolute} {...containerProps}>
      <LoaderSpinner
        style={{
          height: `${size}px`,
          width: `${size}px`,
          borderWidth: `${size / 10}px`,
        }}
        {...loaderProps}
      />
    </LoaderContainer>
  );
}

const FullscreenContainer = styled.div({
  width: "100%",
  minHeight: "100vh",
  height: "100%",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
});

export function FullscreenLoader() {
  return (
    <FullscreenContainer>
      <Loader size={100} />
    </FullscreenContainer>
  );
}
