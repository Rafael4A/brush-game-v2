// styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      main: {
        altBackground: string;
        disabled: string;
        border: string;
        background: string;
        darkBackground: string;
        text: string;
      };
      palette: {
        lightRed: string;
        blue: string;
        yellow: string;
        violet: string;
        lightCyan: string;
        cyanCobalt: string;
        coolBlack: string;
        outerSpace: string;
        orange: string;
        darkRed: string;
        lightBlue: string;
      };
    };
  }
}
