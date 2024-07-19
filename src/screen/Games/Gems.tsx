import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { Card, Col, Form, Input, Radio, Row, Space } from "antd"
import type { FormProps } from "antd"
import { ReactNode, useEffect, useState } from "react"
import _debounce from 'lodash/debounce'
import { GEMS_BET_MINIMUM, GEMS_PROFITS } from "@util/constant"
import _ from "lodash";
import { Icon } from "@component/DesignSystem/Icon"
import useStateCallback from "@hook/common/useStateCallback"
import { BetHistory } from "@component/DesignSystem/BetHistory"

interface FieldType {
  betAmount?: number
}

interface RecordType {
  time?: string
  game?: ReactNode
  bet?: number
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
  const [play, setPlay] = useState<boolean | undefined>()
  const [isChosen, setIsChosen] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [gems, setGems] = useState<Number[][]>([])
  const [record, setRecord] = useState<RecordType[]>([])
  const [currentLevel, setCurrentLevel] = useStateCallback<{
    level: number
    multiplier: number
    profit: number
  }>({
    level: 0,
    multiplier: 0,
    profit: 0.00000000
  })

  const onStartPlaying: FormProps<FieldType>['onFinish'] = () => {
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

  const onAnswer = async (level: number, multiplier: number, answerId: number) => {
    /**
     * level: level+1 = currentLevel
     * multiplier: current multiplier
     * answerId: answer id
     */
    if (formData.betAmount) {
      if (gems[level][answerId] == 1) {
        setIsChosen(prev => prev.map((e, i) => (i === level ? 1 : e)))
        setCurrentLevel({
          level: level + 2,
          multiplier: multiplier,
          profit: formData.betAmount * multiplier
        })
      } else {
        setIsChosen([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        setCurrentLevel({
          level: 10,
          multiplier: 0.00,
          profit: formData.betAmount * -1
        }, () => onStopPlaying())
      }
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

  const onStopPlaying = () => {
    setPlay(false)
    console.log(currentLevel)
    onSaveRecord()
    // onSaveRecord()
  }

  const onCashOut = () => {
    onStopPlaying();
  }

  const onSaveRecord = () => {
    let d = new Date()
    let time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    console.log(time)
    setRecord(record?.concat({
      time: time,
      game: <span className="table-game">
        <Icon icon="diamond" size={14} />
        Gems
      </span>,
      bet: formData.betAmount,
      multiplier: currentLevel.multiplier,
      profit: currentLevel.profit
    }))
  }


  useEffect(() => {
    form.setFieldsValue(formData)
    if (!play && play != undefined) {
      console.log(record)
      // onSaveRecord()
    }

  }, [form, formData, currentLevel, play, record])

  return (
    <Layout title="Gems">
      <Row style={{ width: '100%' }} justify='center' gutter={[24, 24]}>
        <Col md={{ span: 8 }}>
          <Card className="card form gems">
            <Form
              form={form}
              name="gems"
              initialValues={defaultValues}
              onFinish={onStartPlaying}
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
                      {[...Array(_.find(GEMS_PROFITS, ['name', diff])?.column)].map((e, j) =>
                        <Col span={8} key={j}>
                          <Btn block onClick={() => onAnswer(i, d, j)}>
                            {
                              isChosen[i] == 0
                                ? `x` + d
                                : (gems[i][j]
                                  ? <Icon icon="diamond" size={20} />
                                  : '')
                            }
                          </Btn>
                        </Col>
                      )}
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
        <Col md={{ span: 20 }}>
          <BetHistory dataSource={record} />
        </Col>
      </Row>
    </Layout>
  )
}