import { Image } from "antd"
import { FC } from "react"

interface Props {
  src?: string
  w?: number
  h?: number
}

export const Img: FC<Props> = ({ src, w, h }) =>
  <Image preview={false} width={w} height={h} src={src} />