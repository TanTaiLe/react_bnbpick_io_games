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
  betAmount?: number
  profitOnWin?: number
  multiplier?: number
  winChance?: number
  range?: Array<number>
};

const defaultValues = {
  betAmount: 0.00000001,
  profitOnWin: 0.00000001,
  multiplier: 2,
  winChance: 48.5,
  range: [25.75, 74.25],
}

const onValueChange: FormProps<FieldType>['onValuesChange'] = (values) => {
  console.log('Change: ', values)
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

// const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
//   console.log('Failed:', errorInfo);
// };

export const UltimateDice = () => {
  const [newValue, setNewvalue] = useState<FieldType>(defaultValues)
  const [form] = Form.useForm()

  const onHandleChange = (name: string, value: any) => {
    setNewvalue({ [name]: value })
  }

  // const onSliderChange = (values: any) => {
  //   console.log('Success:', values);
  // }

  return (
    <Layout title="Ultimate dice">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 12 }}>
          <Card className="card form">

            <Form
              name="ultimateDice"
              layout="vertical"
              initialValues={newValue ? defaultValues : newValue}
              form={form}
              onFinish={onFinish}
              onValuesChange={useCallback(_debounce(onValueChange, 1000), [])}
              // onFinishFailed={onFinishFailed}
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
                            value={numberFormat(newValue.betAmount, 8)}
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
                            value={numberFormat(newValue.profitOnWin, 8)}
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
                            value={numberFormat(newValue.multiplier, 2)}
                          />
                        </Space.Compact>

                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label="Win Chance" name="winChance">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            suffix={<Icon fill icon="percent" size={20} color="#4caf50" />}
                            value={numberFormat(newValue.winChance, 2)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                {newValue.range &&
                  <div className="form-group">
                    <Row align="bottom" gutter={16}>
                      <Col span={10}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            value={numberFormat(newValue.range[0], 2)}
                          />
                        </Space.Compact>
                      </Col>
                      <Col span={4}>
                        <Flex vertical align="center">
                          <Switch
                          // onChange={onChange}
                          />
                          <span>Inside</span>
                        </Flex>
                      </Col>
                      <Col span={10}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            value={numberFormat(newValue.range[1], 2)}
                            onChange={(value: any) => onHandleChange("range", [value])}
                          />
                        </Space.Compact>
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
                    <Btn block htmlType="submit">ROLL DICE</Btn>
                  </Col>
                  <Col span={6}></Col>
                </Row>

                {newValue.range &&
                  <Slider
                    range={{ draggableTrack: true }}
                    value={newValue.range}
                    step={0.01}
                    onChange={(value: any) => onHandleChange("range", value)}
                  />
                }
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}