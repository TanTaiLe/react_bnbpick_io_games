import { Navigate } from "react-router-dom";
import { PUBLIC_ROUTE } from "@util/constant";
import SecurityService from "@util/sercurityService";
import { NotAuthorized } from "@container/NotAuthorized";

interface IProps {
  type: string;
  children: any;
}

export const AuthenticateRoute = (props: IProps) => {
  if (!SecurityService.isLogged()) {
    if (props.type !== PUBLIC_ROUTE) {
      return <Navigate to={"/authentication"} />;
    }
  }

  if (SecurityService.isLogged() && SecurityService.getUser()?.role !== "admin")
    return <NotAuthorized />;

  return props.children;
};
