import Icon from "@ant-design/icons"
import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { chipsFormat, numberFormat } from "@util/common"
import { ROULETTE_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Space } from "antd"
import { useEffect, useState } from "react"
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
  const [currentChip, setCurrentChip] = useState<number>()

  const [bets, setBets] = useState({});
  const [winningBet, setWinningBet] = useState('-1');

  const handleBet = (betData: any) => {
    const { id } = betData; //lấy id của ô
    console.log(id, betData)

    setBets((prevState) => ({
      ...prevState,
      [id]: {
        icon: '/roulette_chips.svg',
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

  const onChipSelect = (bet: number) => {
    console.log(bet)
    setCurrentChip(bet)
  }

  const onStartAutoBet = () => {
    setAutoPlay(true)
  }
  const onStopAutoBet = () => {
    setAutoPlay(false)
  }

  useEffect(() => {
    console.log(bets)
  }, [bets])

  return (

    <Layout title="Roulette">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 16 }}>
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
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Game History" name="history" className="disabled">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Space>
                </Row>

                <div className="playground roulette">
                  <Row align="middle" gutter={[0, 16]}>
                    <Col span={12}>
                      <div className="roulette-wheel">
                        <RouletteWheel start={play} winningBet={winningBet} />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="roulette-table">
                        <RouletteTable bets={bets} onBet={handleBet} />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="roulette-chip">
                        {ROULETTE_SETTINGS.chips.map((e, i) =>
                          <div className={`roulette-chip-wrapper ${currentChip == e ? 'selected' : ''}`} onClick={() => onChipSelect(e)}>
                            <div key={i} data-coin={e} className="roulette-chip-item">{chipsFormat(e)}</div>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
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