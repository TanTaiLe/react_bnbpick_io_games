import { Btn } from "@component/DesignSystem/Btn"
import { Icon } from "@component/DesignSystem/Icon"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { POKER_BET_MINIMUM, POKER_SETTINGS } from "@util/constant"
import { Card, Col, Form, Input, Row, Space } from "antd"
import { useEffect, useState } from "react"

interface FieldType {
  betAmount: number
};

interface CardType {
  suit: string
  rank: string
}

interface RankCountType {
  [key: string]: any
}

const defaultValues = {
  betAmount: POKER_BET_MINIMUM,
}

export const VideoPoker = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [hand, setHand] = useState<CardType[]>([]);
  const [result, setResult] = useState('');

  const onStartPlaying = (): any => {
    setPlay(true)

    let newHand = [];
    let deckCopy = [...POKER_SETTINGS.deck];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * deckCopy.length);
      newHand.push(deckCopy[randomIndex]);
      deckCopy.splice(randomIndex, 1);
    }
    setHand(newHand);

    setTimeout(() => {
      onStopPlaying()
    }, 300)
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
    if (newValue && newValue >= POKER_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  // Hàm kiểm tra các bộ bài thắng
  const checkHand = (hand: CardType[]) => {
    // Kiểm tra Royal Flush
    if (isRoyalFlush(hand)) return 'Royal Flush';

    // Kiểm tra Straight Flush
    if (isStraightFlush(hand)) return 'Straight Flush';

    // Kiểm tra Four of a Kind
    if (isFourOfAKind(hand)) return 'Four of a Kind';

    // Kiểm tra Full House
    if (isFullHouse(hand)) return 'Full House';

    // Kiểm tra Flush
    if (isFlush(hand)) return 'Flush';

    // Kiểm tra Straight
    if (isStraight(hand)) return 'Straight';

    // Kiểm tra Three of a Kind
    if (isThreeOfAKind(hand)) return 'Three of a Kind';

    // Kiểm tra Two Pair
    if (isTwoPair(hand)) return 'Two Pair';

    // Kiểm tra Jacks or Better
    if (isJacksOrBetter(hand)) return 'Jacks or Better';

    // Không thuộc bộ bài thắng nào
    return 'No Winning Hand';
  };

  // Các hàm kiểm tra từng loại bộ bài thắng (tương tự)
  const isRoyalFlush = (hand: CardType[]) => {
    const ranks = ['A', 'K', 'Q', 'J', '10'];
    const suits = hand.map(card => card.suit);
    const allSameSuit = suits.every(suit => suit === suits[0]);
    const hasAllRanks = ranks.every(rank => hand.some(card => card.rank === rank));
    return allSameSuit && hasAllRanks;
  };

  const isStraightFlush = (hand: CardType[]) => {
    return isStraight(hand) && isFlush(hand);
  };

  const isFourOfAKind = (hand: CardType[]) => {
    const rankCount: RankCountType = {};
    hand.forEach(card => {
      rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    });
    return Object.values(rankCount).includes(4);
  };

  const isFullHouse = (hand: CardType[]) => {
    const rankCount: RankCountType = {};
    hand.forEach(card => {
      rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    });
    const values = Object.values(rankCount);
    return values.includes(3) && values.includes(2);
  };

  const isFlush = (hand: CardType[]) => {
    const suits = hand.map(card => card.suit);
    return suits.every(suit => suit === suits[0]);
  };

  const isStraight = (hand: CardType[]) => {
    const ranks = 'A23456789TJQK';
    const handRanks = hand.map(card => card.rank === '10' ? 'T' : card.rank).sort((a, b) => ranks.indexOf(a) - ranks.indexOf(b));
    const startIndex = ranks.indexOf(handRanks[0]);
    return handRanks.every((rank, index) => ranks[startIndex + index] === rank);
  };

  const isThreeOfAKind = (hand: CardType[]) => {
    const rankCount: RankCountType = {};
    hand.forEach(card => {
      rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    });
    return Object.values(rankCount).includes(3);
  };

  const isTwoPair = (hand: CardType[]) => {
    const rankCount: RankCountType = {};
    hand.forEach(card => {
      rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    });
    const values = Object.values(rankCount);
    return values.filter(value => value === 2).length === 2;
  };

  const isJacksOrBetter = (hand: CardType[]) => {
    const rankCount: RankCountType = {};
    hand.forEach(card => {
      rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    });
    return ['J', 'Q', 'K', 'A'].some(rank => rankCount[rank] === 2);
  };

  useEffect(() => {
    if (hand.length === 5) {
      setResult(checkHand(hand));
    }
  }, [hand]);

  return (
    <Layout title="Video Poker">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 9 }}>
          <Card className="card form">
            <Form
              name="poker"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <div className="playground poker">
                  <div className="poker-set">
                    <Space size={4} direction="vertical" style={{ width: '100%' }}>
                      {POKER_SETTINGS.hands.map((e, i) =>
                        <Row gutter={4} key={i} className={``}>
                          <Col span={19}>
                            <div className="name">
                              <Icon icon="circle" fill />
                              {e.name}
                            </div>
                          </Col>
                          <Col span={5}>
                            <div className="multiplier">
                              {numberFormat(e.multiplier, 2)}x
                            </div>
                          </Col>
                        </Row>
                      )}
                    </Space>
                  </div>
                  <div className="poker-hand">
                    <Row gutter={8}>
                      {[...Array(5)].map((e, i) =>
                        <Col flex="20%" key={i}>
                          <div className="poker-hand-card">
                            <div className={`poker-hand-card-inner`}>
                              <div className="front">
                                <span className="rank"></span>
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
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
                <Row align="middle" gutter={16}>
                  <Col span={6}></Col>
                  <Col span={12}>
                    {
                      play
                        ? <Btn block><Img src="/loading.gif" /></Btn>
                        : <Btn block onClick={onStartPlaying}>BET</Btn>
                    }
                  </Col>
                  <Col span={6}></Col>
                </Row>

                <div className="form-group">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Bet Amount" name="betAmount" className={`${play ? 'disabled' : ''}`}>
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