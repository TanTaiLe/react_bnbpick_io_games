import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { Card, Col, Form, Input, Radio, Row, Space } from "antd"
import { ReactNode, useEffect, useState } from "react"
import _debounce from 'lodash/debounce'
import { GEMS_BET_MINIMUM, GEMS_SETTINGS } from "@util/constant"
import _ from "lodash";
import { Icon } from "@component/DesignSystem/Icon"
import useStateCallback from "@hook/common/useStateCallback"

interface FieldType {
  betAmount: number
}

interface RecordType {
  time?: string
  game?: ReactNode
  bet?: number
  multiplier?: number
  profit?: number
}

const defaultValues = {
  betAmount: GEMS_BET_MINIMUM,
}



export const Gems = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [diff, setDiff] = useState('Easy')
  const [play, setPlay] = useState<boolean | undefined>()
  const [isChosen, setIsChosen] = useState(Array(10).fill(0))
  const [gems, setGems] = useState<Number[][]>([])
  const [record, setRecord] = useState<RecordType[]>([])
  const [gameReset, setGameReset] = useState<boolean>(false);
  const [session, setSession] = useStateCallback<{
    level: number
    multiplier: number
    profit: number
  }>({
    level: 0,
    multiplier: 0,
    profit: 0.00000000
  })

  const onStartPlaying = () => {
    setPlay(true);
    onRandomGems(_.find(GEMS_SETTINGS, ['name', diff])?.gems, _.find(GEMS_SETTINGS, ['name', diff])?.column);
    setIsChosen(Array(10).fill(0))
    setSession({
      level: 1,
      multiplier: 0,
      profit: 0.00000000
    })
  }

  const onChange = (name: string, value: any) => {
    setFormData(prevValue => ({
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
    if (newValue && newValue >= GEMS_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  const onSetDiff = (diff: string) => {
    setDiff(diff)
    onResetGame()
  }

  const onResetGame = () => {
    setGems([])
    setIsChosen(Array(10).fill(0))
    setSession({
      level: 0,
      multiplier: 0,
      profit: 0.00000000
    })
    setGameReset(true) // đánh dấu game reset
  }

  const onAnswer = (level: number, multiplier: number, answerId: number) => {
    /**
     * level: level+1 = session
     * multiplier: current multiplier
     * answerId: answer id
     */
    if (formData.betAmount) {
      if (gems[level][answerId] == 1) {
        setIsChosen(prev => prev.map((e, i) => (i === level ? 1 : e)))
        setSession({
          level: level + 2,
          multiplier: multiplier,
          profit: formData.betAmount * multiplier
        })
      } else {
        setIsChosen(Array(10).fill(1))
        setSession({
          level: 10,
          multiplier: 0,
          profit: formData.betAmount * -1
        }, () => onStopPlaying())
      }
    }
  }

  const onRandomGems = (gemNum: number | any, choiceNum: number | any) => {
    let sets = []
    while (sets.length < 10) {
      const numbers = Array.from({ length: choiceNum }, () => Math.round(Math.random()));
      numbers.filter(num => num === 1).length == gemNum && sets.push(numbers)
    }
    setGems(sets);
  }

  const onStopPlaying = () => {
    setPlay(false)
    console.log(session)
    onSaveRecord()
  }

  const onCashOut = () => {
    onResetGame()
  }

  const onSaveRecord = () => {
    let d = new Date()
    let time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    console.log(time)
    setRecord(record?.concat({
      time: time,
      game: <span className="history-table-game">
        <Icon fill icon="diamond" size={14} />
        Gems
      </span>,
      bet: formData.betAmount,
      multiplier: session.multiplier,
      profit: session.profit
    }))
  }


  useEffect(() => {
    form.setFieldsValue(formData)
    if (!play && play != undefined) {
      console.log(record)
      // onSaveRecord()
    }
    if (gameReset) {
      onStopPlaying()
      setGameReset(false) // Reset lại trạng thái
    }

  }, [form, formData, session, play, record, gameReset])

  return (
    <Layout title="Gems">
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
                    value={numberFormat(session?.profit, 8)}
                    disabled
                  />
                </Space.Compact>
              </Form.Item>
              <div className={`playground ${!play && 'not-allowed'}`}>
                {_.find(GEMS_SETTINGS, ['name', diff])?.multiplier.map((d, i) => (
                  <Row
                    gutter={[4, 4]} key={i}
                    style={{ width: '100%' }}
                    className={`${((i + 1) > session.level) && 'disabled'}`}
                  >
                    {[...Array(_.find(GEMS_SETTINGS, ['name', diff])?.column)].map((e, j) =>
                      <Col span={_.find(GEMS_SETTINGS, ['name', diff])?.column == 3 ? 8 : 12} key={e}>
                        <Btn block onClick={() => onAnswer(i, d, j)}>
                          {
                            isChosen[i] == 0
                              ? `x` + d
                              : (gems[i][j]
                                ? <Icon fill icon="diamond" size={20} />
                                : '')
                          }
                        </Btn>
                      </Col>
                    )}
                  </Row>
                ))}
              </div>
              <Radio.Group
                onChange={e => onSetDiff(e.target.value)}
                value={diff}
                className={`${play && 'disabled'}`}
              >
                {GEMS_SETTINGS.map((d, key) =>
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
                  ? <Btn block onClick={onCashOut} className={`btn-cashout ${isChosen.includes(1) ? '' : (play && 'disabled')}`}>CASHOUT</Btn>
                  : <Btn block onClick={onStartPlaying}>START</Btn>
              }
            </Space>
          </Form>
        </Card>
      </Col>
    </Layout>
  )
}