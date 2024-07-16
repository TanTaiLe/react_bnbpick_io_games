import {Home} from "@screen/Home";
import {Dashboard} from "@screen/Dashboard";

export interface IRouteConfig {
  name: string;
  path: string;
  component: JSX.Element;
}

export const routes: Array<IRouteConfig> = [
  {
    name: "home",
    path: "/",
    component: (
        <Home />
    ),
  },
  {
    name: "dashboard",
    path: "/dashboard",
    component: (
        <Dashboard />
    ),
  },
];
