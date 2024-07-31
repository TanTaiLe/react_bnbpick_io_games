import { Btn } from "@component/DesignSystem/Btn"
import { Icon } from "@component/DesignSystem/Icon"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { LIMBO_BET_MINIMUM, LIMBO_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Space } from "antd"
import { useEffect, useState } from "react"
import CountUp from "react-countup"

interface FieldType {
  betAmount: number
  multiplier: number
  winChance: number
  isAuto: boolean
};

const defaultValues = {
  betAmount: LIMBO_BET_MINIMUM,
  multiplier: 2,
  winChance: 48.5,
  isAuto: false
}

export const Limbo = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [result, setResult] = useState<{ value: number, text: string }>({
    value: 1,
    text: ''
  })

  const onStartPlaying = (): any => {
    setPlay(true)
    const { xMax, xMin } = LIMBO_SETTINGS
    let probality = Math.random(),
      resultMul = 0, resultText = ''

    if (probality <= (formData.winChance / 100)) {
      resultMul = parseFloat((formData.multiplier + Math.random() * (xMax - 2)).toFixed(2));
      resultText = 'win'
    } else {
      resultMul = parseFloat((xMin + Math.random() * (formData.multiplier - xMin)).toFixed(2));
      resultText = 'loss'
    }

    setResult({
      'value': resultMul,
      'text': resultText
    })

    setTimeout(() => {
      setPlay(false)
    }, 800)


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
    if (newValue && newValue >= LIMBO_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  const onStartAutoBet = () => { }
  const onStopAutoBet = () => { }

  useEffect(() => {
    form.setFieldsValue(formData)
    console.log(result)
  }, [form, formData, result])

  return (
    <Layout title="Limbo">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 8 }}>
          <Card className="card form">

            <Form
              name="ultimateBet"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>

                <div className={`playground limbo ${!play && 'not-allowed'}`}>

                  <h1 className={`limbo-result ${result.text}`}>
                    {/* {numberFormat(result.value, 2)}x */}
                    <CountUp
                      start={1.00}
                      end={result.value}
                      decimals={2}
                      decimal="."
                      duration={0.3}
                    />x
                  </h1>
                  <div className={`limbo-explode ${play ? 'active' : ''}`}></div>
                  <div className={`limbo-rocket  ${play ? 'fly' : ''}`}>
                    <div className="limbo-rocket-wrap">
                      <div className="limbo-rocket-body"></div>
                      <div className="limbo-rocket-tail"></div>
                    </div>
                  </div>
                  <div className="limbo-meteor">
                    {[...Array(15)].map((e, i) =>
                      <div className={`limbo-meteor-${i + 1}`}>
                        {e}
                      </div>
                    )}
                  </div>
                </div>
                <Row align="middle" gutter={16}>
                  <Col span={6}>
                    <Checkbox
                      onChange={e => onChange('isAuto', e.target.checked)}
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

                <div className="form-group">
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
                    <Col span={12}>
                      <Form.Item<FieldType> label="Multiplier" name="multiplier">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            suffix={<Icon fill icon="close" size={20} color="#4caf50" />}
                            value={numberFormat(formData.multiplier, 2)}
                            onChange={e => onChange('multiplier', e)}
                          />
                        </Space.Compact>

                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label="Win Chance" name="winChance">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            suffix={<Icon fill icon="percent" size={20} color="#4caf50" />}
                            value={numberFormat(formData.winChance, 2)}
                            onChange={e => onChange('winChance', e)}
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