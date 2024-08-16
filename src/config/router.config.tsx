import { Home } from "@screen/Home";
import { Gems } from "@screen/Games/Gems";
import { Mines } from "@screen/Games/Mines";
import { Limbo } from "@screen/Games/Limbo";
import { UltimateDice } from "@screen/Games/UltimateDice";
import { Roulette } from "@screen/Games/Roulette";
import { WheelOfFortune } from "@screen/Games/WheelOfFortune";
import { Slots } from "@screen/Games/Slots";
import { VideoPoker } from "@screen/Games/VideoPoker";
import { Baccarat } from "@screen/Games/Baccarat";
import { HighLow } from "@screen/Games/HighLow";

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
    name: "slots",
    path: "/slots",
    component: (
      <Slots />
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
    name: "video poker",
    path: "/video-poker",
    component: (
      <VideoPoker />
    ),
  },
  {
    name: "baccarat",
    path: "/baccarat",
    component: (
      <Baccarat />
    ),
  },
  {
    name: "high low",
    path: "/high-low",
    component: (
      <HighLow />
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
