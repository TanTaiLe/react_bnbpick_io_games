import { Btn } from "@component/DesignSystem/Btn";
import { Icon } from "@component/DesignSystem/Icon";
import { Img } from "@component/DesignSystem/Img";
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common";
import { Card, Checkbox, Col, Flex, Form, Input, Radio, Row, Slider, Space, Switch } from "antd"
import { ReactNode, useEffect, useState } from "react";
import _debounce from 'lodash/debounce';
import { ULTIMATE_DICE_BET_MINIMUM } from "@util/constant";
import { spawn } from "child_process";

interface FieldType {
  betAmount: number
  profitOnWin: number
  multiplier: number
  winChance: number
  range: Array<number>
  isAuto: boolean
};

interface AutoCondsType {
  onWin: number // reset = 0, increase by = 1~
  onLoss: number // reset = 0, increase by = 1~
  stopOnProfit: number
  stopOnLoss: number
  bets: number
  profit: number
}

const defaultValues = {
  betAmount: ULTIMATE_DICE_BET_MINIMUM,
  profitOnWin: 0.00000001,
  multiplier: 2,
  winChance: 48.5,
  range: [25.75, 74.25],
  isAuto: false
}

export const UltimateDice = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [swapRange, setSwapRange] = useState<boolean | undefined>()
  const [resultMarker, setResultMarker] = useState<{
    [x: number]: {
      label: ReactNode
    }
  }>()
  const [autoConds, setAutoConds] = useState<AutoCondsType>({
    onWin: 0,
    onLoss: 0,
    stopOnProfit: 0,
    stopOnLoss: 0,
    bets: 0,
    profit: 0
  })

  const onStartPlaying = (): any => {
    setPlay(true)
    let result = parseFloat((Math.random() * 100).toFixed(2)),
      low = formData.range[0],
      high = formData.range[1],
      winChance = formData.winChance,
      probability = Math.random() * 100, // Xác suất từ 0 đến 100
      resultText = ''

    if (low > high) [low, high] = [high, low];

    if (swapRange) {
      if (probability <= winChance) {
        // Nếu xác suất nằm trong khoảng winChance%
        if (low >= result && result >= high) {
          resultText = 'win';
        } else {
          resultText = 'loss';
        }
      } else {
        // Nếu xác suất nằm ngoài khoảng N%
        if (result > low || result < high) {
          resultText = 'loss';
        } else {
          resultText = 'win';
        }
      }
    } else {
      if (probability <= winChance) {
        // Nếu xác suất nằm trong khoảng winChance%
        if (low <= result && result <= high) {
          resultText = 'win';
        } else {
          resultText = 'loss';
        }
      } else {
        // Nếu xác suất nằm ngoài khoảng N%
        if (result < low || result > high) {
          resultText = 'loss';
        } else {
          resultText = 'win';
        }
      }
    }

    resultText == 'win'
      ? console.log('win', formData.betAmount * formData.multiplier)
      : console.log('loss', probability, result, formData.betAmount * -1)

    setResultMarker(() => ({
      [result]: {
        label: <span className={`range-result ${resultText}`}>{result}</span>
      }
    }))
    setTimeout(() => onStopPlaying(), 100)
    return resultText
  }

  const onStartAutoDice = () => {
    setAutoPlay(true)

    let profit = autoConds.profit, // Lợi nhuận lưu lại khi auto play
      stopP = autoConds.stopOnProfit, // Điều kiện dừng khi thẳng đến số n
      stopL = autoConds.stopOnLoss, // Điều kiện dừng khi thua đến số n
      onWin = autoConds.onWin, // nếu thắng thì tăng vốn lên bao nhiêu %
      onLoss = autoConds.onLoss, // nếu thua thì tăng vốn lên bao nhiêu %
      bets = autoConds.bets// đếm số lần bet

    while (profit < stopP && profit > stopL) {
      console.log('Auto dice...')
      const { resultText } = onStartPlaying();
      let change = 0
      if (resultText === 'win') {
        if (onWin > 0) {
          change = formData.betAmount * (onWin / 100);
          profit += change;
        }
      } else {
        if (onLoss > 0) {
          change = formData.betAmount * (onWin / 100);
          profit += change;
        }
      }
      setAutoConds(prev => ({
        ...prev,
        'profit': profit,
        'bets': bets++
      }))

      // Kiểm tra điều kiện dừng
      if (profit >= stopP || profit <= stopL) {
        console.log('Auto dice stop...')
        onStopAutoDice()
        break;
      }
    }


  }

  const onStopAutoDice = () => {
    console.log('Stopping auto dice...');
    setAutoPlay(false)
    onStopPlaying()
  }

  const onChange = (name: string, value: any) => {
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }))
  }

  const onAutoCondChange = (name: string, value: any) => {
    setAutoConds(prevValue => ({
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
    if (newValue && newValue >= ULTIMATE_DICE_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  const onSwapRange = () => {
    setSwapRange(!swapRange)
  }

  const onStopPlaying = () => {
    setPlay(false)
    // onSaveRecord()
  }

  useEffect(() => {
    form.setFieldsValue(formData)
  }, [form, formData])

  return (
    <Layout title="Ultimate dice">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 12 }}>
          <Card className="card form">
            <Form
              name="ultimateDice"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <div className="form-group">
                  <Row gutter={16}>
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
                      <Form.Item<FieldType> label="Profit On Win" name="profitOnWin">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.profitOnWin, 8)}
                            onChange={e => onChange('profitOnWin', e)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="form-group">
                  <Row gutter={16}>
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

                {formData.range &&
                  <div className="form-group">
                    <Row align="bottom" gutter={16}>
                      <Col span={10}>
                        <Form.Item label="Low">
                          <Space.Compact style={{ width: '100%' }}>
                            <Input
                              value={numberFormat(formData.range[0], 2)}
                            />
                          </Space.Compact>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Flex vertical align="center">
                          <Switch
                            onChange={onSwapRange}
                          />
                          <span>{swapRange ? 'Outside' : 'Inside'}</span>
                        </Flex>
                      </Col>
                      <Col span={10}>
                        <Form.Item label="High">
                          <Space.Compact style={{ width: '100%' }}>
                            <Input
                              value={numberFormat(formData.range[1], 2)}
                            />
                          </Space.Compact>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                }
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
                          ? <Btn block onClick={onStopAutoDice}> <Img src="/loading.gif" /> STOP</Btn>
                          : <Btn block onClick={onStartAutoDice}>AUTO DICE</Btn>
                        : play
                          ? <Btn block><Img src="/loading.gif" /></Btn>
                          : <Btn block onClick={onStartPlaying}>ROLL DICE</Btn>
                    }
                  </Col>
                  <Col span={6}></Col>
                </Row>

                <div className={`range ${swapRange ? 'range-reverse' : ''}`}>
                  <span className="range-min-max">0</span>
                  {formData.range &&
                    <Slider
                      range={{ draggableTrack: true }}
                      marks={resultMarker}
                      value={formData.range}
                      step={0.01}
                      onChange={(value: any) => onChange("range", value)}
                      className="range-slider"
                    />
                  }
                  <span className="range-min-max">100</span>
                </div>


                {formData.isAuto &&
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div className="form-group not-input">
                          <Form.Item label="On Win">
                            <Radio.Group
                              onChange={e => onAutoCondChange('onWin', e.target.value)}
                              value={autoConds.onWin}
                              className={`${play && 'disabled'}`}
                            >
                              <Space direction="vertical" size={0}>
                                <Radio value={0}>Reset</Radio>
                                <Radio value={1}>
                                  Increase By
                                  <Space.Compact className={`radio-input ${autoConds.onWin == 0 ? 'disabled' : ''}`}>
                                    <Input
                                      suffix={<Icon fill icon="percent" size={20} color="#4caf50" />}
                                      value={100}
                                      onChange={e => onAutoCondChange('onWin', e.target.value)}
                                    />
                                  </Space.Compact>
                                </Radio>
                              </Space>
                            </Radio.Group>
                          </Form.Item>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="form-group not-input">
                          <Form.Item label="On Loss">
                            <Radio.Group
                              onChange={e => onAutoCondChange('onLoss', e.target.value)}
                              value={autoConds.onLoss}
                              className={`${play && 'disabled'}`}
                            >
                              <Space direction="vertical" size={0}>
                                <Radio value={0}>Reset</Radio>
                                <Radio value={1}>
                                  Increase By
                                  <Space.Compact className={`radio-input ${autoConds.onLoss == 0 ? 'disabled' : ''}`}>
                                    <Input
                                      suffix={<Icon fill icon="percent" size={20} color="#4caf50" />}
                                      value={100}
                                      onChange={e => onAutoCondChange('onLoss', e.target.value)}
                                    />
                                  </Space.Compact>
                                </Radio>
                              </Space>
                            </Radio.Group>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>

                    <div className="form-group">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Stop On Profit">
                            <Space.Compact style={{ width: '100%' }}>
                              <Input
                                prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                                value={numberFormat(autoConds.stopOnProfit, 8)}
                                onChange={e => onAutoCondChange('stopOnProfit', e)}
                              />
                            </Space.Compact>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Stop On Loss">
                            <Space.Compact style={{ width: '100%' }}>
                              <Input
                                prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                                value={numberFormat(autoConds.stopOnLoss, 8)}
                                onChange={e => onAutoCondChange('stopOnLoss', e)}
                              />
                            </Space.Compact>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>

                    <div className="form-group">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Bets">
                            <Space.Compact style={{ width: '100%' }}>
                              <Input
                                value={autoConds.bets}
                              // onChange={e => onAutoCondChange('bets', e)}
                              />
                            </Space.Compact>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Profit">
                            <Space.Compact style={{ width: '100%' }}>
                              <Input
                                prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                                value={numberFormat(autoConds.profit, 8)}
                              // onChange={e => onAutoCondChange('profit', e)}
                              />
                            </Space.Compact>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </>
                }

              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}