import { Btn } from "@component/DesignSystem/Btn";
import { Icon } from "@component/DesignSystem/Icon";
import { Img } from "@component/DesignSystem/Img";
import { Layout } from "@component/DesignSystem/Layout"
import type { FormProps, CheckboxProps } from 'antd';
import { Card, Checkbox, Col, Flex, Form, Input, Row, Slider, Space, Switch } from "antd"

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
  return (
    <Layout title="Ultimate dice">
      <Row style={{ width: '100%' }} justify='center'>
        <Col span={12}>
          <Card className="card form">
            <Form
              name="ultimateDice"
              layout="vertical"
              // initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <div className="form-group">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item<FieldType>
                        label="Bet Amount"
                        name="betAmount"
                      >
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                          />
                          <div className="btn-group">
                            <Btn>2X</Btn>
                            <Btn>1/2</Btn>
                          </div>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType>
                        label="Profit On Win"
                        name="profitOnWin"
                      >
                        <Input
                          prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="form-group">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item<FieldType>
                        label="Multiplier"
                        name="multiplier"
                      >
                        <Input
                          suffix={<Icon icon="close" size={20} color="#4caf50" />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType>
                        label="Win Chance"
                        name="winChance"
                      >
                        <Input
                          suffix={<Icon icon="percent" size={20} color="#4caf50" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="form-group">
                  <Row align="bottom" gutter={16}>
                    <Col span={10}>
                      <Form.Item<FieldType>
                        label="Low"
                        name="low"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Flex vertical align="center">
                        <Switch defaultChecked onChange={onChange} />
                        <span>Inside</span>
                      </Flex>
                    </Col>
                    <Col span={10}>
                      <Form.Item<FieldType>
                        label="High"
                        name="high"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Row align="middle" gutter={16}>
                  <Col span={6}>
                    <Checkbox onChange={onCheckboxCheck}>Auto</Checkbox>
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