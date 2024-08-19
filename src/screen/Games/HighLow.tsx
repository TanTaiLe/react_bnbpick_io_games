import { Btn } from "@component/DesignSystem/Btn"
import { Icon } from "@component/DesignSystem/Icon"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { CARD_GAMES_SETTINGS, HIGH_LOW_BET_MINIMUM } from "@util/constant"
import { Card, Col, Form, Input, Row, Space } from "antd"
import { useEffect, useState } from "react"

interface FieldType {
  betAmount: number
};

interface CardType {
  suit: string
  rank: string
}

const defaultValues = {
  betAmount: HIGH_LOW_BET_MINIMUM,
}

export const HighLow = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [board, setBoard] = useState<CardType>()
  const [history, setHistory] = useState<CardType[]>()

  const onStartPlaying = () => {
    setPlay(true);
  }

  const onDrawCard = () => {
    let deckCopy = [...CARD_GAMES_SETTINGS.deck];
    const randomIndex = Math.floor(Math.random() * deckCopy.length);
    setBoard(deckCopy[randomIndex])
    setHistory(prev => [...(prev || []), deckCopy[randomIndex]])
  }

  const onStopPlaying = () => {
    setPlay(false)
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
    if (newValue && newValue >= HIGH_LOW_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  const onSetBet = () => {
    onDrawCard();
  }

  const onGetButtonText = (side: string) => {
    if (side === 'higher') {
      if (board?.rank === 'K') return <>EQUAL <Icon fill icon="equal" weight={700} /></>
      if (board?.rank === 'A') return <>HIGHER <Icon fill icon="keyboard_arrow_up" weight={700} /></>
      return <>HIGHER or EQUAL <Icon fill icon="keyboard_double_arrow_up" weight={700} /></>

    } else { //lower
      if (board?.rank === 'K') return <>LOWER <Icon fill icon="keyboard_arrow_down" weight={700} /></>
      if (board?.rank === 'A') return <>EQUAL <Icon fill icon="equal" weight={700} /></>
      return <>LOWER or EQUAL <Icon fill icon="keyboard_double_arrow_down" weight={700} /></>
    }
  }

  const onGetPercentage = (side: string) => {
    const totalCards = [...CARD_GAMES_SETTINGS.deck].length
    let remainCards

    if (side === 'higher') {
      if (board?.rank === 'K') return 3 / totalCards * 100 // xác suất ra 3 lá K chất còn lại
      else if (board?.rank === 'A') { // xác suất ra các lá còn lại trừ 4 lá A
        remainCards = totalCards - 4
        return remainCards / totalCards * 100
      } else {
        // Xác suất ra lá lớn hơn hoặc bằng giá trị hiện tại
        remainCards = ((14 - onConvertCardToValue(board?.rank)) * 4) + 3; // 3 lá cùng rank khác chất + các lá lớn hơn
        return (remainCards / totalCards) * 100;
      }
    } else {
      if (board?.rank === 'K') { // xác suất ra các lá còn lại trừ 4 lá K
        remainCards = totalCards - 4
        return remainCards / totalCards * 100
      }
      else if (board?.rank === 'A') return 3 / totalCards * 100 // xác suất ra 3 lá A chất còn lại
      else {
        // Xác suất ra lá nhỏ hơn hoặc bằng giá trị hiện tại
        remainCards = (onConvertCardToValue(board?.rank) * 4) - 1; // Trừ 1 lá hiện tại
        return (remainCards / totalCards) * 100;
      }
    }
  }

  const onConvertCardToValue = (card: string | undefined) => {
    if (card === 'A') return 1;
    if (card === 'J') return 11;
    if (card === 'Q') return 12;
    if (card === 'K') return 13;
    return parseInt(card!);
  };

  useEffect(() => {
    !board && onDrawCard()
  },)

  return (
    <Layout title="High Low">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 9 }}>
          <Card className="card form">
            <Form
              name="highLow"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <div className="playground highlow">
                  <div className="highlow-board">
                    <div className="highlow-guide">
                      <b>K<Icon icon="vertical_align_top" size={32} /></b>
                      <span>KING BEING THE HIGHEST</span>
                    </div>

                    <div className="highlow-hand">
                      <div className="highlow-hand-card">
                        <div className="highlow-hand-card-inner flipped">
                          <div className="front"></div>
                          <div className="back">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <Icon icon="help" fill color="#fff" />
                          </div>
                        </div>
                      </div>
                      <div className="highlow-hand-card">
                        <div className="highlow-hand-card-inner flipped">
                          <div className="front"></div>
                          <div className="back">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <Icon icon="help" fill color="#fff" />
                          </div>
                        </div>
                      </div>
                      {board &&
                        <div className="highlow-hand-card">
                          <div className="highlow-hand-card-inner">
                            <div className="front">
                              <span style={{ color: `${(board.suit == 'hearts' || board.suit == 'diamonds') ? '#f44336' : '#000'}` }}>
                                {board.rank}
                              </span>
                              <Img src={`/card_${board.suit}.png`} />
                            </div>
                            <div className="back">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <Icon icon="help" fill color="#fff" />
                            </div>
                          </div>
                        </div>
                      }
                    </div>

                    <div className="highlow-guide">
                      <b>A<Icon icon="vertical_align_bottom" size={32} /></b>
                      <span>ACE BEING THE LOWEST</span>
                    </div>
                  </div>
                  <div className="highlow-history">
                    {history?.map(e =>
                      <div className="highlow-hand-card">
                        <div className="highlow-hand-card-inner">
                          <div className="front">
                            <span style={{ color: `${(e.suit == 'hearts' || e.suit == 'diamonds') ? '#f44336' : '#000'}` }}>
                              {e.rank}
                            </span>
                            <Img src={`/card_${e.suit}.png`} />
                          </div>
                          <div className="back">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <Icon icon="help" fill color="#fff" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Row align="middle" gutter={8}>
                  <Col span={12}>
                    <Btn block className="btn-vertical btn-high" onClick={() => onSetBet()}>
                      {onGetButtonText('higher')}
                      <span>{numberFormat(onGetPercentage('higher'), 2)}%</span>
                    </Btn>
                  </Col>
                  <Col span={12}>
                    <Btn block className="btn-vertical btn-low" onClick={() => onSetBet()}>
                      {onGetButtonText('lower')}
                      <span>{numberFormat(onGetPercentage('lower'), 2)}%</span>
                    </Btn>
                  </Col>
                </Row>

                <div className={`form-group ${play ? 'disabled' : ''}`}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item<FieldType> label="Bet Amount" name="betAmount">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                            onChange={e => onChange('betAmount', e)}
                          />
                          <div className="btn-group">
                            <Btn onClick={onBetDouble}>2X</Btn>
                            <Btn onClick={onBetHalf}>1/2</Btn>
                          </div>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label={`Total Profit (${numberFormat(1.00, 2)}x)`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label={`Profit Higher (${numberFormat(3.15, 2)}x)`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<FieldType> label={`Profit Lower (${numberFormat(1.26, 2)}x)`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Row align="middle" gutter={16}>
                  <Col span={4}></Col>
                  <Col span={16}>
                    {
                      play
                        ? <Btn block><Img src="/loading.gif" /></Btn>
                        : <Btn block onClick={onStartPlaying}>BET</Btn>
                    }
                  </Col>
                  <Col span={4}></Col>
                </Row>

              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}