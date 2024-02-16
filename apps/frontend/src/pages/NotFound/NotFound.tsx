import { Link } from "react-router-dom";

import { ROUTES } from "shared-code";

import { MainContainer } from "../../components";

export function NotFoundScreen() {
  return (
    <MainContainer>
      <h1>404 - Not Found</h1>
      <p>This page does not exist!</p>
      <Link to={ROUTES.HOME}>Go to the main menu</Link>
    </MainContainer>
  );
}
