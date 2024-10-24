import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { PLINKO_BET_MINIMUM, PLINKO_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Select, Space } from "antd"
import { useMediaQuery } from 'react-responsive'
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
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [autoPlayPosition, setAutoPlayPosition] = useState<{ x: number, y: number }[]>([])
  const [multiplier, setMultiplier] = useState<number[]>([])
  const [dropRange, setDropRange] = useState<{
    start: number,
    end: number
  }[]>()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const ballIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const finalPosRef = useRef(position)
  const autoPlayFinalPosRef = useRef(autoPlayPosition)
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const onStartPlaying = () => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        console.log('play')

        isMobile
          ? setAutoPlayPosition([...autoPlayPosition, { x: 8.5, y: -0.75 }])
          : setAutoPlayPosition([...autoPlayPosition, { x: 12.5, y: -0.5 }])

        // setPlay(true);

        // setTimeout(() => {
        //   onAutoPlayCheckResult()
        // }, isMobile ? 1500 : 1800)
      }, 1000)
    } else {
      isMobile
        ? setPosition({ x: 8.5, y: -0.75 })
        : setPosition({ x: 12.5, y: -0.5 })

      setPlay(true);

      setTimeout(() => {
        onCheckResult()
      }, isMobile ? 1500 : 1800)
    }
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

  const onUpdateMultiplier = () => {
    const { risk } = PLINKO_SETTINGS
    const multiplierOnRisk = risk.find(r => r.value === formData.risk)?.multiplier!
    let newMultiplier: number[] = []

    multiplierOnRisk.some((_, i) => {
      const reverseIndex = multiplierOnRisk.length - 1 - i;
      reverseIndex >= 0
        && reverseIndex < multiplierOnRisk.length
        && newMultiplier.push(multiplierOnRisk[reverseIndex])
    })
    multiplierOnRisk.some((e, i) => {
      i > 0
        && i < multiplierOnRisk.length
        && newMultiplier.push(e)
    })

    setMultiplier(newMultiplier)
  }

  const onSetupDropRange = () => {
    // const containerW = 388 // multiplier container width 
    const spacingW = isMobile ? 24 : 28 // Spacing = 24 (real spacing) + 8/2 (peg width)
    const pegW = isMobile ? 4 : 8 // Peg width
    let baseDropRange: any[] = []
    multiplier.some((_, i) => {
      let start, end
      if (i === 0) {
        start = 0;
        end = start + spacingW + pegW / 2;
      }
      else if (i === 1) {
        start = i * (spacingW + pegW / 2);
        end = start + spacingW + pegW;
      }
      else if (i === 10) {
        start = i * (spacingW + pegW) - 4;
        end = 388;
      }
      else {
        start = i * (spacingW + pegW) - 4;
        end = start + spacingW + pegW;
      }
      baseDropRange.push({ start: start, end: end })
    });

    setDropRange(baseDropRange)
    console.log(baseDropRange)
  }

  const onCheckResult = () => {
    let dropPos = isMobile
      ? finalPosRef.current.x * 18
      : finalPosRef.current.x * 18 - 54
    console.log('Final pos:', finalPosRef.current.x)

    dropRange?.forEach((e, i) => {
      if (dropPos >= e.start && dropPos <= e.end) {
        console.log(`Drop at tile [#${i + 1} - ${multiplier[i]}x]`, e, finalPosRef.current)
      }
    })
    onStopPlaying()
  }

  const onAutoPlayCheckResult = () => {
    autoPlayFinalPosRef.current.forEach(e => {
      let dropPos = isMobile
        ? e.x * 18
        : e.x * 18 - 54
      console.log('Final pos:', e.x)

      dropRange?.forEach((f, i) => {
        if (dropPos >= f.start && dropPos <= f.end) {
          console.log(`Drop at tile [#${i + 1} - ${multiplier[i]}x]`, f, e)
        }
      })
    })
    onStopPlaying()
  }

  useEffect(() => {
    form.setFieldsValue(formData)

    onUpdateMultiplier()
    finalPosRef.current = position
    autoPlayFinalPosRef.current = autoPlayPosition

    if (play) {
      ballIntervalRef.current = setInterval(() => {
        setPosition(prev => ({
          x: prev.x + (Math.random() < 0.5 ? -1 : 1),
          y: prev.y + 1
        }));
      }, 150);
    }

    if (autoPlay) {
      onStartPlaying()
      // if (play) {
        // autoPlayPosition.length != 0 &&
        //   autoPlayPosition.forEach((_, i) => {
        //     ballIntervalRef.current = setInterval(() => {

        //       setAutoPlayPosition(prev => []);
        //     }, 150);
        //   })
      // }
    }
    console.log(autoPlayPosition)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (ballIntervalRef.current) {
        clearInterval(ballIntervalRef.current)
      }
    };
  }, [autoPlay, form, formData, play, position, autoPlayPosition])

  useEffect(() => {
    !dropRange
      && multiplier.length > 0
      && onSetupDropRange()
  }, [dropRange, multiplier])

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
                    !autoPlay && play &&
                    <div className="plinko-ball"
                      style={{
                        left: `${position.x * 18}px`,
                        top: `${position.y * 36}px`
                      }}>
                      <Img src='/plinko_ball.svg' w={isMobile ? 16 : 20} h={isMobile ? 16 : 20} />
                    </div>
                  }
                  {
                    autoPlay && autoPlayPosition.length != 0 && autoPlayPosition.map((e, i) =>
                      <div className="plinko-ball" key={i}
                        style={{
                          left: `${e.x * 18}px`,
                          top: `${e.y * 36}px`
                        }}>
                        <Img src='/plinko_ball.svg' w={isMobile ? 16 : 20} h={isMobile ? 16 : 20} />
                      </div>
                    )
                  }
                  <div className="plinko-multiplier">
                    {multiplier.map((e, i) =>
                      <div key={i} className="plinko-multiplier-item">
                        {e}x
                      </div>
                    )}
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
                    <Col sm={{ span: 16 }} xs={{ span: 24 }}>
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
                    <Col sm={{ span: 8 }} xs={{ span: 24 }}>
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