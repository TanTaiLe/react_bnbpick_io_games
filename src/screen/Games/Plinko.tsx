import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { PLINKO_BET_MINIMUM, PLINKO_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Select, Space } from "antd"
import { useEffect, useRef, useState } from "react"

interface FieldType {
  betAmount: number
  isAuto: boolean
  risk: string
};

const defaultValues = {
  betAmount: PLINKO_BET_MINIMUM,
  isAuto: false,
  risk: 'low'
}

export const Plinko = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [position, setPosition] = useState({ x: 9.5, y: 0 });
  const [multiplier, setMultiplier] = useState<number[]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const ballIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const onStartPlaying = () => {
    setPosition({ x: 9.5, y: 0 })
    setPlay(true);

    setTimeout(() => {
      onStopPlaying()
    }, 3000)
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
    if (newValue && newValue >= PLINKO_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  const onStartAutoBet = () => {
    setAutoPlay(true)
  }

  const onStopAutoBet = () => {
    setAutoPlay(false)
  }

  useEffect(() => {
    form.setFieldsValue(formData)

    const { risk } = PLINKO_SETTINGS
    let newMultiplier = risk.find(r => r.value === formData.risk)?.multiplier!
    setMultiplier(newMultiplier)

    if (play) {
      ballIntervalRef.current = setInterval(() => {
        setPosition(prev => ({
          x: prev.x + (Math.random() < 0.5 ? -1 : 1),
          y: prev.y + 1
        }));
      }, 500);
    }

    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        onStartPlaying()
        console.log('play')
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (ballIntervalRef.current) {
        clearInterval(ballIntervalRef.current)
      }
    };
  }, [autoPlay, form, formData, play])
  return (
    <Layout title="Plinko">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 9 }}>
          <Card className="card form">
            <Form
              name="plinko"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>

                <div className="playground plinko">
                  <div className="plinko-board">
                    {Array.from({ length: PLINKO_SETTINGS.rows }, (_, rowIndex) => (
                      <div className="plinko-row" key={rowIndex}>
                        {Array.from({ length: rowIndex + 3 }, (_, i) => (
                          <div className="plinko-peg" key={i}></div>
                        ))}
                      </div>
                    ))}
                  </div>
                  {
                    <div className="plinko-ball"
                      style={{
                        left: `${position.x * 20}px`,
                        top: `${position.y * 20}px`
                      }}>
                      <Img src='/plinko_ball.svg' w={20} h={20} />
                    </div>
                  }
                  <div className="plinko-multiplier">
                    {multiplier.map((e, i) => {
                      const reverseIndex = multiplier.length - 1 - i;
                      if (reverseIndex >= 0 && reverseIndex < multiplier.length) {
                        return <div key={reverseIndex} className="plinko-multiplier-item">
                          {multiplier[reverseIndex]}x
                        </div>
                      }
                    })}
                    {multiplier.map((e, i) => {
                      if (i > 0 && i < multiplier.length) {
                        return <div key={e} className="plinko-multiplier-item">
                          {e}x
                        </div>
                      }
                    })}
                  </div>
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
                          : <Btn block onClick={onStartAutoBet}>AUTO BET</Btn>
                        : play
                          ? <Btn block><Img src="/loading.gif" /></Btn>
                          : <Btn block onClick={onStartPlaying}>BET</Btn>
                    }
                  </Col>
                  <Col span={6}></Col>
                </Row>

                <div className={`form-group ${autoPlay ? 'disabled' : play ? 'disabled' : ''}`}>
                  <Row gutter={16}>
                    <Col span={16}>
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
                    <Col span={8}>
                      <Form.Item label="Risk" name="risk" className={`${play && 'disabled'}`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Select
                            defaultValue={defaultValues.risk}
                            style={{ width: 120 }}
                            onChange={e => onChange('risk', e)}
                            options={PLINKO_SETTINGS.risk}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}