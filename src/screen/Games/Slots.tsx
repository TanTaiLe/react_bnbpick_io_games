import { Btn } from "@component/DesignSystem/Btn"
import { Icon } from "@component/DesignSystem/Icon"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { SLOTS_BET_MINIMUM, SLOTS_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Select, Space } from "antd"
import { useEffect, useRef, useState } from "react"

interface FieldType {
  betAmount: number
  lines: number
  isAuto: boolean
};

const defaultValues = {
  betAmount: SLOTS_BET_MINIMUM,
  lines: 1,
  isAuto: false
}

export const Slots = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [columnResult, setColumnResult] = useState([90, -90, -70])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const onStartPlaying = (): any => {
    setPlay(true)

    setColumnResult(prev => prev.map(val => val + onGetRandomValue()))

    setTimeout(() => {
      onStopPlaying()
    }, 300)
  }

  const onStopPlaying = () => {
    setPlay(false)
  }

  const onGetRandomValue = () => {
    let random = Math.floor(Math.random() * ((360 - 10) / 10))
    // console.log(random * 10)
    return -10 - random * 10
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
    if (newValue && newValue >= SLOTS_BET_MINIMUM)
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

  const onConvertResult = () => {
    let cvResult: any = []

    columnResult.map(e => {
      let convertedValue = e

      while (convertedValue < 0) {
        convertedValue += 360
      }

      cvResult.push(convertedValue / 10)
    })

    return cvResult
  }

  const checkRowWin = (offset: number, rowIndex: number) => {
    const { columns } = SLOTS_SETTINGS
    let cr = onConvertResult()
    const [c1, c2, c3] = [columns[0][cr[0] + offset], columns[1][cr[1] + offset], columns[2][cr[2] + offset]];
    console.log(c1 === c2 && c2 === c3 ? `Row ${rowIndex} win` : `Row ${rowIndex} lose`);
  };

  const onCheckResult = () => {
    checkRowWin(0, 1); // Luôn kiểm tra dòng giữa

    if (formData.lines >= 2) {
      checkRowWin(-1, 2); // Kiểm tra dòng trước đó
    }

    if (formData.lines === 3) {
      checkRowWin(1, 3); // Kiểm tra dòng sau đó
    }
  }



  useEffect(() => {
    form.setFieldsValue(formData)

    play && onCheckResult()

    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        onStartPlaying()
        console.log('play')
      }, 300)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, form, formData, onCheckResult])

  return (
    <Layout title="Slots">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 10 }}>
          <Card className="card form">
            <Form
              name="slots"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <div className="playground slots">
                  <div className="slots-indicators">
                    {[...Array(3)].map((e, i) =>
                      <div className={`slots-indicator ${i + 1 <= formData.lines ? 'active' : ''} slots-indicator-${i + 1}`}>
                        {[...Array(3)].map(j => <span key={j}></span>)}
                      </div>
                    )}
                  </div>
                  <Row style={{ width: '100%' }}>
                    {SLOTS_SETTINGS.columns.map((e, i) =>
                      <Col span={8} key={i}>
                        <div className={`slots-column slots-column-${i + 1}`}>
                          <div className="slots-cycle slots-cycle-start" style={{ transform: `rotateX(${columnResult[i]}deg)` }}>
                            {e.map(d => <Img src={SLOTS_SETTINGS.tile[d]} />)}
                          </div>
                        </div>
                      </Col>
                    )}
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
                      <Form.Item label="Lines" name="lines" className={`${play && 'disabled'}`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Select
                            defaultValue={defaultValues.lines}
                            style={{ width: 120 }}
                            onChange={e => onChange('lines', e)}
                            options={Array.from({ length: 3 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                          />
                          <div className="select-icon">
                            <Icon fill icon="format_list_numbered" size={20} color="#8bc34a" />
                          </div>
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