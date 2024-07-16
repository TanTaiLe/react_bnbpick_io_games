import { Btn } from "@component/DesignSystem/Btn";
import { Layout } from "@component/DesignSystem/Layout"
import type { FormProps } from 'antd';
import { Card, Checkbox, Col, Flex, Form, Input, Row, Switch } from "antd"

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

export const UltimateDice = () => {
  return (
    <Layout title="Ultimate dice">
      <Row style={{ width: '100%' }}>
        <Col span={12} offset={6}>
          <Card className="card form">
            <Form
              name="ultimateDice"
              layout="vertical"
              // initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <div className="form-group">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item<FieldType>
                      label="Bet Amount"
                      name="betAmount"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item<FieldType>
                      label="Profit On Win"
                      name="profitOnWin"
                    >
                      <Input />
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
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item<FieldType>
                      label="Win Chance"
                      name="winChance"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="form-group">
                <Row gutter={16}>
                  <Col span={10}>
                    <Form.Item<FieldType>
                      label="Low"
                      name="low"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Switch defaultChecked onChange={onChange} />
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
              <Flex align="center" justify="space-between">
                
              </Flex>

            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}