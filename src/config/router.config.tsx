import { Home } from "@screen/Home";
import { Gems } from "@screen/Games/Gems";
import { Mines } from "@screen/Games/Mines";
import { Limbo } from "@screen/Games/Limbo";
import { UltimateDice } from "@screen/Games/UltimateDice";
import { Roulette } from "@screen/Games/Roulette";
import { WheelOfFortune } from "@screen/Games/WheelOfFortune";

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
    name: "roulette",
    path: "/roulette",
    component: (
      <Roulette />
    ),
  },
  {
    name: "wheel of fortune",
    path: "/wheel-of-fortune",
    component: (
      <WheelOfFortune />
    ),
  },
  {
    name: "limbo",
    path: "/limbo",
    component: (
      <Limbo />
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
