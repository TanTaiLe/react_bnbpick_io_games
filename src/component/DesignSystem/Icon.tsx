import { FC } from "react"
import { MaterialSymbol } from "react-material-symbols"
import { SymbolCodepoints } from "../../../node_modules/react-material-symbols/dist/types"
import 'react-material-symbols/rounded';

interface Props {
  icon?: SymbolCodepoints | any,
  size?: number,
  color?: string,
  fill?: boolean,
}

export const Icon: FC<Props> = ({ icon, size, color, fill }) =>
  <MaterialSymbol
    icon={icon}
    size={size}
    fill={fill}
    weight={300}
    grade={200}
    color={color}
  />
