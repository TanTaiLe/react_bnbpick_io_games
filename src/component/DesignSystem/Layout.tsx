import { FC, ReactNode } from "react"

interface Props {
  children?: ReactNode,
  title?: string,
}

export const Layout: FC<Props> = ({ children, title }) => {
  return (
    <section className="game">
      <h1>{title}</h1>
      {children}
    </section>
  )
}