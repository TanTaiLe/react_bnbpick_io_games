import { Home } from "@screen/Home";
import { UltimateDice } from "@screen/Games/UltimateDice";
import { Gems } from "@screen/Games/Gems";

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
    name: "gems",
    path: "/gems",
    component: (
      <Gems />
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
