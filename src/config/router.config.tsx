import { Home } from "@screen/Home";
import { UltimateDice } from "@screen/Games/UltimateDice";

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
    name: "ultimate dice",
    path: "/ultimate-dice",
    component: (
      <UltimateDice />
    ),
  },
];
