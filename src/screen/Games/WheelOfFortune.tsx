import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { WHEEL_OF_FORTUNE_BET_MINIMUM, WHEEL_OF_FORTUNE_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Space } from "antd"
import { useEffect, useRef, useState } from "react"

interface FieldType {
  betAmount: number
  isAuto: boolean
};

const defaultValues = {
  betAmount: WHEEL_OF_FORTUNE_BET_MINIMUM,
  isAuto: false
}

export const WheelOfFortune = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [wheelPosition, setWheelPosition] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const onStartPlaying = (): any => {
    setPlay(true)

    const random = Math.floor(Math.random() * ((360 - 30) / 30 + 1)) // rotate 1 cycle then random
    const result = 30 + random * 30

    // console.log('Roll:', result)
    setWheelPosition(prev => prev + result)

    setTimeout(() => {
      onStopPlaying()
    }, 500)


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
    if (newValue && newValue >= WHEEL_OF_FORTUNE_BET_MINIMUM)
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

  const onCheckResult = (wheelPos: number) => {
    for (let i = 0; i < WHEEL_OF_FORTUNE_SETTINGS.length; i++) {
      let adjustedWheelPosition = wheelPos;

      while (adjustedWheelPosition > 360) {
        adjustedWheelPosition -= 360;
      }
      if (WHEEL_OF_FORTUNE_SETTINGS[i].position == adjustedWheelPosition) {
        console.log(WHEEL_OF_FORTUNE_SETTINGS[i]);
      }
    }
  }

  useEffect(() => {
    form.setFieldsValue(formData)

    onCheckResult(wheelPosition);

    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        onStartPlaying()
        console.log('play')
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, form, formData, wheelPosition])

  return (
    <Layout title="Wheel Of Fortune">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 8 }}>
          <Card className="card form">
            <Form
              name="wheelOfFortune"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={24}>
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
                </Row>
                <div className="playground wheel">
                  <div className="wheel-container">
                    <div className="wheel-main" style={{ transform: `rotate(${wheelPosition}deg)` }} />
                    <div className="wheel-shadow" />
                    <div className="wheel-mask" />
                    <div className="wheel-pointer" />
                    <div className="wheel-center" />
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