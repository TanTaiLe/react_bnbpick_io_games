import { FC } from "react"
import { MaterialSymbol } from "react-material-symbols"
import { SymbolCodepoints } from "../../../node_modules/react-material-symbols/dist/types"
import 'react-material-symbols/rounded';

interface Props {
  icon?: SymbolCodepoints | any
  size?: number
  weight?: 300 | 100 | 200 | 400 | 500 | 600 | 700 | 800 | 900 | undefined
  color?: string
  fill?: boolean
}

export const Icon: FC<Props> = ({ icon, size, weight, color, fill }) =>
  <MaterialSymbol
    icon={icon}
    size={size}
    fill={fill}
    weight={weight || 300}
    grade={200}
    color={color}
  />
