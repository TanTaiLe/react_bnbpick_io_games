import { BetHistory } from "@component/DesignSystem/BetHistory";
import { Btn } from "@component/DesignSystem/Btn";
import { Icon } from "@component/DesignSystem/Icon";
import { Img } from "@component/DesignSystem/Img";
import { Layout } from "@component/DesignSystem/Layout"
import useStateCallback from "@hook/common/useStateCallback";
import { numberFormat } from "@util/common";
import { MINES_BET_MINIMUM, MINES_SETTINGS } from "@util/constant";
import { Card, Checkbox, Col, Form, Input, Row, Select, Space } from "antd"
import type { FormProps } from "antd"
import { useEffect, useState } from "react";

interface FieldType {
  betAmount?: number
}

const defaultValues = {
  betAmount: MINES_BET_MINIMUM,
}

export const Mines = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [session, setSession] = useStateCallback<{
    multiplier: number
    profit: number
  }>({
    multiplier: 0,
    profit: 0.00000000
  })

  const onStartPlaying: FormProps<FieldType>['onFinish'] = () => {
    setPlay(true);
    // onRandomGems(_.find(GEMS_SETTINGS, ['name', diff])?.gems, _.find(GEMS_SETTINGS, ['name', diff])?.column);
    // setIsChosen([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    // setCurrentLevel({
    //   level: 1,
    //   multiplier: 0,
    //   profit: 0.00000000
    // })
  };

  const onChange = (name: string, value: any) => {
    setFormData({ [name]: value })
  }

  const onBetDouble = () => {
    let newValue = formData.betAmount && formData.betAmount * 2
    setFormData({ 'betAmount': newValue })
  }

  const onBetHalf = () => {
    let newValue = formData.betAmount && formData.betAmount / 2
    if (newValue && newValue >= MINES_BET_MINIMUM)
      setFormData({ 'betAmount': newValue })
  }

  const onStopPlaying = () => {
    setPlay(false)
    console.log(session)
    // onSaveRecord()
  }

  const onCashOut = () => {
    onStopPlaying();
  }

  useEffect(() => {
    form.setFieldsValue(formData)
    if (!play && play != undefined) {
      // console.log(record)
      // onSaveRecord()
    }

  }, [form, formData, play])

  return (
    <Layout title="Mines">
      <Row style={{ width: '100%' }} justify='center' gutter={[24, 24]}>
        <Col md={{ span: 8 }}>
          <Card className="card form mines">
            <Form
              form={form}
              name="gems"
              initialValues={defaultValues}
              onFinish={onStartPlaying}
              layout="vertical"
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <div className="form-group">
                  <Space size="small" direction="vertical" style={{ width: '100%' }}>
                    <Form.Item<FieldType> label="Bet Amount" name="betAmount" className={`${play && 'disabled'}`}>
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
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Mines" name="mines" className={`${play && 'disabled'}`}>
                          <Space.Compact style={{ width: '100%' }}>
                            <Select
                              defaultValue="3"
                              style={{ width: 120 }}
                              onChange={onChange}
                              options={Array.from({ length: 24 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                            />
                            <div className="select-icon">
                              <Icon fill icon="bomb" size={20} color="#ff5722" />
                            </div>
                          </Space.Compact>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Gems" name="gem" className="disabled">
                          <Space.Compact style={{ width: '100%' }}>
                            <Input
                              suffix={<Icon fill icon="diamond" size={20} color="#8bc34a" />}
                              value={22}
                              disabled
                            />
                          </Space.Compact>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Space>
                </div>
                <div className="form-group">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={`Profit On Next Tile (${''}x)`} name="nextProfit" className="disabled">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData?.betAmount, 8)}
                            disabled
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={`Total Profit (${''}x)`} name="totalProfit" className="disabled">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData?.betAmount, 8)}
                            disabled
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className={`playground ${!play && 'not-allowed'}`}>
                  <Row gutter={8}>
                    {[...Array(25)].map((e, i) =>
                      <Col flex="20%" key={i}>
                        <Btn className="tile">
                          <div className="tile-back"></div>
                          <div className="tile-front">

                          </div>
                        </Btn>
                      </Col>
                    )}
                  </Row>
                </div>

                <Row gutter={16} align="middle">
                  <Col span={5}>
                    <Checkbox
                    // onChange={onChange}
                    >Auto</Checkbox>
                  </Col>
                  <Col span={14}>
                    {
                      play
                        ? <Btn block onClick={onCashOut}>CASHOUT</Btn>
                        : <Btn block htmlType="submit">START</Btn>
                    }
                  </Col>
                  <Col span={5}>
                  </Col>
                </Row>
              </Space>
            </Form>
          </Card>
        </Col>
        <Col md={{ span: 22 }}>
          <BetHistory
          // dataSource={record} need API to fetch Data for rendering
          />
        </Col>
      </Row>
    </Layout>
  )
}