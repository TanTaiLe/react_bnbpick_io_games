import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { Card, Col, Form, Input, Radio, Row, Space } from "antd"
import type { FormProps } from "antd"
import { useCallback, useEffect, useState } from "react"
import _debounce from 'lodash/debounce'
import { GEMS_BET_MINIMUM, GEMS_PROFITS } from "@util/constant"

interface FieldType {
  profit?: number
  betAmount?: number
}

const defaultValues = {
  profit: 0.00000000,
  betAmount: 0.00000100,
}



export const Gems = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [diff, setDiff] = useState('Easy')

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onChange = (name: string, value: any) => {
    console.log(name, value)
    setFormData({ [name]: value })
  }

  const onBetDouble = () => {
    let newValue = formData.betAmount && formData.betAmount * 2
    setFormData({ 'betAmount': newValue })
  }

  const onBetHalf = () => {
    let newValue = formData.betAmount && formData.betAmount / 2
    if (newValue && newValue >= GEMS_BET_MINIMUM)
      setFormData({ 'betAmount': newValue })
  }

  const switchDifficult = (value: string) => {

  }

  useEffect(() => {
    form.setFieldsValue(formData)
  }, [form, formData])

  return (
    <Layout title="Gems">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 12 }}>
          <Card className="card form">
            <Form
              form={form}
              name="gems"
              initialValues={defaultValues}
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <Form.Item<FieldType> label="Profit" name="profit" className="disabled">
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                      value={numberFormat(formData?.profit, 8)}
                      disabled
                    />
                  </Space.Compact>
                </Form.Item>
                <Row style={{ width: '100%' }}>
                  {GEMS_PROFITS.map(value =>
                    <Col></Col>
                  )}
                  <Col span={8}>
                    <Radio.Group
                      onChange={e => setDiff(e.target.value)}
                      value={diff}
                    >
                      {GEMS_PROFITS.map((d, key) =>
                        <Radio key={key} value={d.name}>{d.name}</Radio>
                      )}
                    </Radio.Group>
                  </Col>
                </Row>
                <Form.Item<FieldType> label="Bet Amount" name="betAmount">
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                      value={numberFormat(formData?.betAmount, 8)}
                      onChange={e => onChange('betAmount', e.currentTarget.value)}
                    />
                    <div className="btn-group">
                      <Btn onClick={onBetDouble}>2X</Btn>
                      <Btn onClick={onBetHalf}>1/2</Btn>
                    </div>
                  </Space.Compact>
                </Form.Item>
                <Btn block htmlType="submit">START</Btn>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}