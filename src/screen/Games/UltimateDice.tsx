import { Btn } from "@component/DesignSystem/Btn";
import { Icon } from "@component/DesignSystem/Icon";
import { Img } from "@component/DesignSystem/Img";
import { Layout } from "@component/DesignSystem/Layout"
import type { FormProps, CheckboxProps } from 'antd';
import { Card, Checkbox, Col, Flex, Form, Input, Row, Slider, Space, Switch } from "antd"
import { useEffect, useState } from "react";

type FieldType = {
  betAmount?: number
  profitOnWin?: number
  multiplier?: number
  winChance?: number
  low?: number
  high?: number
  outside?: boolean // false = inside, true = outside
  auto?: boolean
};

const defaultValues = {
  betAmount: 0.00000001,
  profitOnWin: 0.00000001,
  multiplier: 2,
  winChance: 48.5,
  low: 25.75,
  high: 74.25,
  outside: false,
  auto: false,
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const onCheckboxCheck: CheckboxProps['onChange'] = (e) => {
  console.log(`checked = ${e.target.checked}`);
};

export const UltimateDice = () => {
  const [values, setValues] = useState<FieldType>()
  const [form] = Form.useForm();

  console.log(values)
  useEffect(() => {
    setValues(defaultValues)
    // console.log(values)
    // form.setFieldsValue({
    //   betAmount: 0.00000001,
    //   profitOnWin: 0.00000001,
    //   multiplier: 2,
    //   winChance: 48.5,
    //   low: 25.75,
    //   high: 74.25,
    //   outside: false,
    //   auto: false,
    // });
  }, [])

  return (
    <Layout title="Ultimate dice">
      <Row style={{ width: '100%' }} justify='center'>
        <Col span={12}>
          <Card className="card form">
            <Form
              name="ultimateDice"
              layout="vertical"
              initialValues={values}
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
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
                            value={values?.betAmount?.toLocaleString("en", { minimumFractionDigits: 8 })}
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
                            value={values?.profitOnWin?.toLocaleString("en", { minimumFractionDigits: 8 })}
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
                            suffix={<Icon icon="close" size={20} color="#4caf50" />}
                            value={values?.multiplier?.toLocaleString("en", { minimumFractionDigits: 2 })}
                          />
                        </Space.Compact>

                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label="Win Chance" name="winChance">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            suffix={<Icon icon="percent" size={20} color="#4caf50" />}
                            value={values?.winChance?.toLocaleString("en", { minimumFractionDigits: 2 })}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="form-group">
                  <Row align="bottom" gutter={16}>
                    <Col span={10}>
                      <Form.Item<FieldType> label="Low" name="low">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            value={values?.low?.toLocaleString("en", { minimumFractionDigits: 2 })}
                          />
                        </Space.Compact>

                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      {/* <Form.Item<FieldType> name="outside"> */}
                      <Flex vertical align="center">
                        <Switch
                          checked={values?.outside}
                          onChange={onChange}
                        />
                        <span>Inside</span>
                      </Flex>
                      {/* </Form.Item> */}
                    </Col>
                    <Col span={10}>
                      <Form.Item<FieldType> label="High" name="high">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            value={values?.high?.toLocaleString("en", { minimumFractionDigits: 2 })}
                          />
                        </Space.Compact>

                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Row align="middle" gutter={16}>
                  <Col span={6}>
                    {/* <Form.Item<FieldType> name="auto"> */}
                    <Checkbox
                      checked={values?.auto}
                      onChange={onCheckboxCheck}
                    >Auto</Checkbox>
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={12}>
                    <Btn block htmlType="submit">ROLL DICE</Btn>
                  </Col>
                  <Col span={6}></Col>
                </Row>
                <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} />
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}