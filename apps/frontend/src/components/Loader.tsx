import styled from "styled-components";

const LoaderSpinner = styled.div(({ theme }) => ({
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
}));

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
}: ILoaderProps) {
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
