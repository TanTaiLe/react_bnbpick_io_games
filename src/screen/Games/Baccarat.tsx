import { Btn } from "@component/DesignSystem/Btn"
import { Icon } from "@component/DesignSystem/Icon"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { BACCARAT_BET_MINIMUM, CARD_GAMES_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Radio, Row, Space } from "antd"
import { useEffect, useRef, useState } from "react"

interface FieldType {
  betAmount: number
  isAuto: boolean
};

interface CardType {
  suit: string
  rank: string
}

const defaultValues = {
  betAmount: BACCARAT_BET_MINIMUM,
  isAuto: false
}

export const Baccarat = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [betOn, setBetOn] = useState<'player' | 'banker' | 'tie'>('player')
  const [playerHand, setPlayerHand] = useState<CardType[]>([])
  const [bankerHand, setBankerHand] = useState<CardType[]>([])
  const [deckCopy, setDeckCopy] = useState([...CARD_GAMES_SETTINGS.deck])
  const [result, setResult] = useState('')
  const [beginDraw, setBeginDraw] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const onStartPlaying = async (): Promise<void> => {
    setPlay(true);
    setDeckCopy([...CARD_GAMES_SETTINGS.deck])
    setBeginDraw(true)
    setPlayerHand([])
    setBankerHand([])
    setResult('')

    let newPlayerHand: CardType[] = [];
    let newBankerHand: CardType[] = [];

    for (let i = 0; i < 2; i++) {
      await onDrawCardWithDelay(newPlayerHand, newBankerHand);
    }

    setTimeout(() => {
      onCheckResult(newPlayerHand, newBankerHand)
    }, 500)
  }

  const onDrawCardWithDelay = async (playerHand: CardType[], bankerHand: CardType[]) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        onDrawCard(playerHand, 'player');
        setTimeout(() => {
          onDrawCard(bankerHand, 'banker');
        }, 500)
        resolve();
      }, 1000)
    });
  };

  const onStopPlaying = () => {
    setPlay(false)
    setBeginDraw(false)
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
    if (newValue && newValue >= BACCARAT_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  const onStartAutoBet = () => {
    setAutoPlay(true)
  }

  const onStopAutoBet = () => {
    setAutoPlay(false)
  }

  const onSumPoints = (hand: CardType[]) => {
    let sumVal = 0;

    for (let i = 0; i < hand.length; i++) {
      let nextVal = hand[i].rank
      nextVal == 'J' || nextVal == 'Q' || nextVal == 'K'
        ? sumVal += 10
        : nextVal == 'A'
          ? sumVal += 1
          : sumVal += parseInt(nextVal)
    }

    while (sumVal >= 10) {
      sumVal -= 10
    }

    return sumVal
  }

  const onCheckResult = (pHand: CardType[], bHand: CardType[]) => {
    let playerPoint = onSumPoints(pHand);
    let bankerPoint = onSumPoints(bHand);
    let resultOnBet = '';
    let playerHandCopy = [...pHand]
    let bankerHandCopy = [...bHand]

    const checkAndUpdateHands = () => {
      if (playerPoint <= 5) {
        // Player draws another card
        playerHandCopy = onDrawCard(playerHandCopy, 'player');
        playerPoint = onSumPoints(playerHandCopy);
        setPlayerHand(playerHandCopy);
      }

      if (bankerPoint <= 5) {
        // Banker draws another card
        bankerHandCopy = onDrawCard(bankerHandCopy, 'banker');
        bankerPoint = onSumPoints(bankerHandCopy);
        setBankerHand(bankerHandCopy);
      }

      if (playerPoint > bankerPoint) {
        setResult('player');
        resultOnBet = 'player';
      } else if (playerPoint < bankerPoint) {
        setResult('banker');
        resultOnBet = 'banker';
      } else {
        setResult('tie');
        resultOnBet = 'tie';
      }

      if (betOn === resultOnBet) {
        console.log('Win bet');
      } else {
        console.log('Lose bet');
      }

      onStopPlaying();
    };

    setTimeout(checkAndUpdateHands, 500);
  }

  const onDrawCard = (hand: CardType[], side: string): CardType[] => {
    const randomIndex = Math.floor(Math.random() * deckCopy.length);
    const card = deckCopy[randomIndex];
    hand.push(card);
    setDeckCopy(deckCopy.filter((_, index) => index !== randomIndex));
    side == 'player'
      ? setPlayerHand([...hand])
      : setBankerHand([...hand])
    console.log(hand)
    return hand;
  }

  useEffect(() => {
    form.setFieldsValue(formData)

    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        onStartPlaying()
        console.log('play')
      }, 500)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, form, formData, play])

  return (
    <Layout title="Baccarat">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 9 }}>
          <Card className="card form">
            <Form
              name="baccarat"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>

                <div className="playground baccarat">

                  <div className="baccarat-side">
                    <div className="baccarat-hand">
                      {bankerHand.map((e, i) =>
                        <div className="baccarat-hand-card" key={i}>
                          <div className={`
                                baccarat-hand-card-inner flipped
                                ${result == 'tie' ? 'tie' : result == 'banker' ? 'won' : ''}
                                
                              `}>
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
                    <span className={`baccarat-point ${result == 'tie' ? 'tie' : result == 'banker' ? 'won' : ''}`}>
                      Banker: {onSumPoints(bankerHand)}
                    </span>
                  </div>

                  <div className="baccarat-payout">
                    <Icon icon="trophy" fill size={20} />
                    Tie pay 8 to 1
                  </div>

                  <div className="baccarat-side">
                    <div className="baccarat-hand">
                      {playerHand.map((e, i) =>
                        <div className="baccarat-hand-card" key={i}>
                          <div className={`
                                baccarat-hand-card-inner flipped
                                ${result == 'tie' ? 'tie' : result == 'player' ? 'won' : ''}
                                
                              `}>
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
                    <span className={`baccarat-point ${result == 'tie' ? 'tie' : result == 'player' ? 'won' : ''}`}>
                      Player: {onSumPoints(playerHand)}
                    </span>
                  </div>

                  <div className="baccarat-deck">
                    <div className="baccarat-hand">
                      {[...Array(3)].map((_, i) =>
                        <div className="baccarat-hand-card" key={i}>
                          <div className="baccarat-hand-card-inner flipped non-animate">
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
                      )}
                    </div>
                    {
                      beginDraw &&
                      <div className={`baccarat-hand-card animate ${beginDraw ? 'active' : ''}`}>
                        <div className="baccarat-hand-card-inner flipped non-animate">
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
                    }
                  </div>
                </div>

                <Row align="middle" gutter={16}>
                  <Col span={6}>
                    <Checkbox
                      onChange={e => onChange('isAuto', e.target.checked)}
                      className={`${autoPlay ? 'disabled' : play ? 'disabled' : ''}`}
                    >Auto</Checkbox>
                  </Col>
                  <Col span={12}>
                    {
                      formData.isAuto
                        ? autoPlay
                          ? <Btn block onClick={onStopAutoBet}> <Img src="/loading.gif" /> STOP</Btn>
                          : <Btn block onClick={onStartAutoBet}>AUTO BET</Btn>
                        : play
                          ? <Btn block><Img src="/loading.gif" /></Btn>
                          : <Btn block onClick={onStartPlaying}>BET</Btn>
                    }
                  </Col>
                  <Col span={6}></Col>
                </Row>

                <div className="form-group form-group-radio">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Bet On" className={`${autoPlay ? 'disabled' : play ? 'disabled' : ''}`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Radio.Group
                            onChange={e => setBetOn(e.target.value)}
                            value={betOn}
                          >
                            <Radio value="player">Player</Radio>
                            <Radio value="banker">Banker</Radio>
                            <Radio value="tie">Tie</Radio>
                          </Radio.Group>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="form-group">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Bet Amount" name="betAmount" className={`${autoPlay ? 'disabled' : play ? 'disabled' : ''}`}>
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
                  </Row>
                </div>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>

  )
}