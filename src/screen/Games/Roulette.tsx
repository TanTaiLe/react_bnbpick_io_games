import Icon from "@ant-design/icons"
import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { Card, Checkbox, Col, Form, Input, Row, Space } from "antd"
import { useState } from "react"
import { RouletteTable, RouletteWheel } from 'react-casino-roulette';
import 'react-casino-roulette/dist/index.css';

interface FieldType {
  betAmount: number
  history: number[]
  isAuto: boolean
};

const defaultValues = {
  betAmount: 0,
  history: [],
  isAuto: false
}


export const Roulette = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean>(false)
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [bets, setBets] = useState({});
  const [winningBet, setWinningBet] = useState('-1');

  const handleBet = (betData: any) => {
    const { id } = betData;

    setBets((prevState) => ({
      ...prevState,
      [id]: {
        icon: 'https://cdn-icons-png.flaticon.com/512/10095/10095709.png',
      },
    }));
  };

  const onStartPlaying = (): any => {
    setPlay(true)
    setWinningBet('00');

    setTimeout(() => {
      onStopPlaying()
    }, 800)
  }

  const onStopPlaying = () => {
    setPlay(false)
  }

  const onChange = (name: string, value: any) => {
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }))
    console.log(name, value)
  }

  const onStartAutoBet = () => {
    setAutoPlay(true)
  }
  const onStopAutoBet = () => {
    setAutoPlay(false)
  }

  return (

    <Layout title="Roulette">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 8 }}>
          <Card className="card form">

            <Form
              name="limbo"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <Row gutter={16}>

                  <Space size="small" direction="vertical" style={{ width: '100%' }}>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Total Bet" name="betAmount" className="disabled">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          // onChange={e => onChange('betAmount', e)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Game History" name="history" className="disabled">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                          // value={numberFormat(formData.betAmount, 8)}
                          // onChange={e => onChange('betAmount', e)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Space>
                </Row>

                <div className="playgound roulette">
                  <RouletteWheel start={play} winningBet={winningBet} />
                  <RouletteTable bets={bets} onBet={handleBet} />
                </div>

                <Row align="middle" gutter={16}>
                  <Col span={6}>
                    <Checkbox
                      onChange={e => onChange('isAuto', e.target.checked)}
                      className={`${autoPlay ? 'disabled' : play ? 'disabled' : ''}`}
                    >Auto</Checkbox>
                  </Col>
                  <Col span={12}>
                    {
                      formData.isAuto
                        ? autoPlay
                          ? <Btn block onClick={onStopAutoBet}> <Img src="/loading.gif" /> STOP</Btn>
                          : <Btn block onClick={onStartAutoBet}>AUTO SPIN</Btn>
                        : play
                          ? <Btn block><Img src="/loading.gif" /></Btn>
                          : <Btn block onClick={onStartPlaying}>SPIN</Btn>
                    }
                  </Col>
                  <Col span={6}></Col>
                </Row>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}