import { Link } from "react-router-dom";
import { MainContainer } from "../../components";
import { ROUTES } from "../../resources/constants";

export function NotFoundScreen() {
  return (
    <MainContainer>
      <h1>404 - Not Found</h1>
      <p>This page does not exist!</p>
      <Link to={ROUTES.HOME}>Go to the main menu</Link>
    </MainContainer>
  );
}
