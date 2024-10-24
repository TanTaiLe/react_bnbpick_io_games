import { Col, Row, Space } from "antd"
import { FC, ReactNode } from "react"
import { BetHistory } from "./BetHistory"
import { GameInfo } from "./GameInfo"

interface Props {
  children?: ReactNode,
  title?: string,
}

export const Layout: FC<Props> = ({ children, title }) => {
  return (
    <section className="game">
      <h1>{title}</h1>
      <Row style={{ width: '100%' }} justify='center' gutter={[24, 24]}>
        {children}
        <Col md={{ span: 22 }} xs={{ span: 24 }}>
          <GameInfo />
        </Col>
        <Col md={{ span: 22 }} xs={{ span: 24 }}>
          <BetHistory />
        </Col>
      </Row>
    </section>
  )
}