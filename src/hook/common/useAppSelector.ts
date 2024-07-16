import type { TypedUseSelectorHook } from "react-redux";
import { useSelector } from "react-redux";

import type { RootState } from "@store/index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
