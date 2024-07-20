import { Home } from "@screen/Home";
import { UltimateDice } from "@screen/Games/UltimateDice";
import { Gems } from "@screen/Games/Gems";
import { Mines } from "@screen/Games/Mines";

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
    name: "mines",
    path: "/mines",
    component: (
      <Mines />
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
