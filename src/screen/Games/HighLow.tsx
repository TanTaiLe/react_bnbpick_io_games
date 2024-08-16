import { Btn } from "@component/DesignSystem/Btn"
import { Icon } from "@component/DesignSystem/Icon"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { HIGH_LOW_BET_MINIMUM } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Space } from "antd"
import { useState } from "react"

interface FieldType {
  betAmount: number
};

interface CardType {
  suit: string
  rank: string
}

interface BoardType {
  current: CardType
  high: CardType[]
  low: CardType[]
}

const defaultValues = {
  betAmount: HIGH_LOW_BET_MINIMUM,
}

export const HighLow = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [rate, setRate] = useState(0)
  const [board, setBoard] = useState<BoardType>()
  const [history, setHistory] = useState<CardType[]>()

  const onStartPlaying = async (): Promise<void> => {
    setPlay(true);

    setTimeout(() => {
      // onCheckResult(newPlayerHand, newBankerHand)
    }, 200)
  }

  const onStopPlaying = () => {
    setPlay(false)
  }


  const onChange = (name: string, value: any) => {
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }))
  }

  const onBetDouble = () => {
    let newValue = formData.betAmount && formData.betAmount * 2
    setFormData(prevValue => ({
      ...prevValue,
      'betAmount': newValue
    }))
  }

  const onBetHalf = () => {
    let newValue = formData.betAmount && formData.betAmount / 2
    if (newValue && newValue >= HIGH_LOW_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  return (
    <Layout title="High Low">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 9 }}>
          <Card className="card form">
            <Form
              name="highLow"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <div className="playground highlow">
                  <div className="highlow-board">

                  </div>
                  <div className="highlow-history">

                  </div>
                </div>

                <Row align="middle" gutter={8}>
                  <Col span={12}>
                    <Btn block className="btn-vertical btn-high">
                      <>HIGHER or EQUAL <Icon fill icon="keyboard_double_arrow_up" /></>
                      <span>38.46%</span>
                    </Btn>
                  </Col>
                  <Col span={12}>
                    <Btn block className="btn-vertical btn-low">
                      <>LOWER or EQUAL <Icon fill icon="keyboard_double_arrow_down" /></>
                      <span>69.23%</span>
                    </Btn>
                  </Col>
                </Row>

                <div className={`form-group ${play ? 'disabled' : ''}`}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item<FieldType> label="Bet Amount" name="betAmount">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                            onChange={e => onChange('betAmount', e)}
                          />
                          <div className="btn-group">
                            <Btn onClick={onBetDouble}>2X</Btn>
                            <Btn onClick={onBetHalf}>1/2</Btn>
                          </div>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label={`Total Profit (${numberFormat(1.00, 2)}x)`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label={`Profit Higher (${numberFormat(3.15, 2)}x)`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label={`Profit Lower (${numberFormat(1.26, 2)}x)`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Row align="middle" gutter={16}>
                  <Col span={4}></Col>
                  <Col span={16}>
                    {
                      play
                        ? <Btn block><Img src="/loading.gif" /></Btn>
                        : <Btn block onClick={onStartPlaying}>BET</Btn>
                    }
                  </Col>
                  <Col span={4}></Col>
                </Row>

              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}