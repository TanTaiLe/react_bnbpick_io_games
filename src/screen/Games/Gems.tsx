import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { Card, Col, Flex, Form, Input, Radio, Row, Space } from "antd"
import type { FormProps } from "antd"
import { Fragment, useCallback, useEffect, useState } from "react"
import _debounce from 'lodash/debounce'
import { GEMS_BET_MINIMUM, GEMS_PROFITS } from "@util/constant"
import _ from "lodash";
import { wrap } from "module"
import { Icon } from "@component/DesignSystem/Icon"

interface FieldType {
  betAmount?: number
}

interface RecordType {
  time?: string
  game?: string
  betAmount?: number
  multiplier?: number
  profit?: number
}

const defaultValues = {
  profit: 0.00000000,
  betAmount: 0.00000100,
}



export const Gems = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [diff, setDiff] = useState('Easy')
  const [play, setPlay] = useState(false)
  const [isChosen, setIsChosen] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [currentLevel, setCurrentLevel] = useState<{
    level: number
    multiplier: number
    profit: number
  }>({
    level: 0,
    multiplier: 0,
    profit: 0.00000000
  })
  const [gems, setGems] = useState<Number[][]>([])

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setPlay(true);
    onRandomGems();
    setIsChosen([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    setCurrentLevel({
      level: 1,
      multiplier: 0,
      profit: 0.00000000
    })
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
    if (newValue && newValue >= GEMS_BET_MINIMUM)
      setFormData({ 'betAmount': newValue })
  }

  const onAnswer = (level: number, multiplier: number, answerId: number) => {
    /**
     * level: level+1 = currentLevel
     * multiplier: current multiplier
     * answerId: answer id
     */
    if (formData.betAmount && gems[level][answerId] == 1) {
      setIsChosen(prev => prev.map((e, i) => (i === level ? 1 : 0)))
      setCurrentLevel({
        level: level + 2,
        multiplier: multiplier,
        profit: formData.betAmount * multiplier
      })
    } else {
      setPlay(false)
      setCurrentLevel({
        level: 10,
        multiplier: 0,
        profit: 0.00000000
      })
      setIsChosen([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    }
  }

  const onRandomGems = () => {
    let sets = []
    while (sets.length < 10) {
      const numbers = Array.from({ length: 3 }, () => Math.round(Math.random()));
      numbers.filter(num => num === 1).length == 2 && sets.push(numbers)
    }
    setGems(sets);
  }

  const onCashOut = () => {
    setPlay(false)
  }

  useEffect(() => {
    form.setFieldsValue(formData)
  }, [form, formData])

  return (
    <Layout title="Gems">
      <Row style={{ width: '100%' }} justify='center'>
        <Col md={{ span: 8 }}>
          <Card className="card form gems">
            <Form
              form={form}
              name="gems"
              initialValues={defaultValues}
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <Form.Item label="Profit" name="profit" className="disabled">
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                      value={numberFormat(currentLevel?.profit, 8)}
                      disabled
                    />
                  </Space.Compact>
                </Form.Item>
                <div className={`playground ${!play && 'not-allowed'}`}>
                  {_.find(GEMS_PROFITS, ['name', diff])?.multiplier.map((d, i) => (
                    <Row
                      gutter={[4, 4]} key={i}
                      style={{ width: '100%' }}
                      className={`${((i + 1) > currentLevel.level) && 'disabled'}`}
                    >
                      <Col span={8}>
                        <Btn block onClick={() => onAnswer(i, d, 0)}>
                          {isChosen[i] == 0 ? `x` + d : (gems[i][0] ? <Icon icon="diamond" size={20} /> : '')}
                        </Btn>
                      </Col>
                      <Col span={8}>
                        <Btn block onClick={() => onAnswer(i, d, 1)}>
                          {isChosen[i] == 0 ? `x` + d : (gems[i][1] ? <Icon icon="diamond" size={20} /> : '')}
                        </Btn>
                      </Col>
                      <Col span={8}>
                        <Btn block onClick={() => onAnswer(i, d, 2)}>
                          {isChosen[i] == 0 ? `x` + d : (gems[i][2] ? <Icon icon="diamond" size={20} /> : '')}
                        </Btn>
                      </Col>
                    </Row>
                  ))}
                </div>
                <Radio.Group
                  onChange={e => setDiff(e.target.value)}
                  value={diff}
                  className={`${play && 'disabled'}`}
                >
                  {GEMS_PROFITS.map((d, key) =>
                    <Radio key={key} value={d.name}>{d.name}</Radio>
                  )}
                </Radio.Group>
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
                {
                  play
                    ? <Btn block onClick={onCashOut}>CASHOUT</Btn>
                    : <Btn block htmlType="submit">START</Btn>
                }
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}