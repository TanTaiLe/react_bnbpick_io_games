import { Btn } from "@component/DesignSystem/Btn";
import { Icon } from "@component/DesignSystem/Icon";
import { Img } from "@component/DesignSystem/Img";
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common";
import type { FormProps, CheckboxProps } from 'antd';
import { Card, Checkbox, Col, Flex, Form, Input, Row, Slider, Space, Switch } from "antd"
import { useForm } from "antd/es/form/Form";
import { useEffect, useState, useCallback } from "react";
import _debounce from 'lodash/debounce';

type FieldType = {
  betAmount: number
  profitOnWin: number
  multiplier: number
  winChance: number
  range: Array<number>
};

const defaultValues = {
  betAmount: 0.00000001,
  profitOnWin: 0.00000001,
  multiplier: 2,
  winChance: 48.5,
  range: [25.75, 74.25],
}

export const UltimateDice = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [swapRange, setSwapRange] = useState<boolean | undefined>()

  const onStartPlaying = () => {
    setPlay(true);
    let result = parseFloat((Math.random() * 100).toFixed(2));
    let low = formData.range[0]
    let high = formData.range[1]
    if (formData) {
      if (low > high)
        [low, high] = [high, low];

      if (swapRange) {
        if (result <= low && result >= high)
          console.log('Win')
        else
          console.log('Lose')
      } else {
        if (result >= low && result <= high)
          console.log('Win')
        else
          console.log('Lose')
      }
    }
  }

  const onChange = (name: string, value: any) => {
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }))
  }

  const onSwapRange = () => {
    setSwapRange(!swapRange)
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
                            <Btn>2X</Btn>
                            <Btn>1/2</Btn>
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
                    // onChange={onCheckboxCheck}
                    >Auto</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Btn block onClick={onStartPlaying}>ROLL DICE</Btn>
                  </Col>
                  <Col span={6}></Col>
                </Row>

                <div className={`range ${swapRange ? 'range-reverse' : ''}`}>
                  <span className="range-min-max">0</span>
                  {formData.range &&
                    <Slider
                      range={{ draggableTrack: true }}
                      value={formData.range}
                      step={0.01}
                      onChange={(value: any) => onChange("range", value)}
                      className="range-slider"
                    />
                  }
                  <span className="range-min-max">100</span>
                </div>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}