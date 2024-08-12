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
  const [hand, setHand] = useState<CardType[]>([])
  const [handIsMatch, setHandIsMatch] = useState('')
  const [hold, setHold] = useState<CardType[]>([])
  const [holdIsMatch, setHoldIsMatch] = useState('')
  const [flipped, setFlipped] = useState(true)
  const [dealed, setDealed] = useState(true)
  const [winning, setWinning] = useState<CardType[]>([])


  const onStartPlaying = (): any => {
    setPlay(true)
    setFlipped(true);
    onResetGame()

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
      setFlipped(false);
    }, 300)
  }

  const onStopPlaying = () => {
    setPlay(false)
  }

  const onResetGame = () => {
    setDealed(false)
    setHold([])
    setWinning([])
    setHandIsMatch('')
    setHoldIsMatch('')
  }

  const onDealing = () => {
    setPlay(true)
    setFlipped(true);

    let newHand = [...hand]; // Bắt đầu với bộ bài hiện tại
    let deckCopy = POKER_SETTINGS.deck.filter(card => !hand.includes(card)); // Lọc ra các lá bài chưa được sử dụng

    for (let i = 0; i < newHand.length; i++) {
      if (!hold.includes(newHand[i])) {
        const randomIndex = Math.floor(Math.random() * deckCopy.length);
        newHand[i] = deckCopy[randomIndex];
        deckCopy.splice(randomIndex, 1);
      }
    }
    setHand(newHand);

    setTimeout(() => {
      onStopPlaying()
      setFlipped(false);
      setDealed(true)
    }, 300)
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

  const onHoldCard = (card: CardType) => {
    setHold(prev =>
      prev.includes(card)
        ? prev.filter(c => c != card)
        : [...prev, card]
    )
  }

  // Hàm kiểm tra các bộ bài thắng
  const onCheckHand = (hand: CardType[]) => {
    let winningCards: CardType[] = [];

    // Kiểm tra Royal Flush
    if (isRoyalFlush(hand)) {
      if (dealed) {
        setHandIsMatch('ROYAL FLUSH');
        winningCards = hand.filter(card => isRoyalFlushCard(card));
      } else {
        setHoldIsMatch('ROYAL FLUSH');
      }
    }

    // Kiểm tra Straight Flush
    else if (isStraightFlush(hand)) {
      if (dealed) {
        setHandIsMatch('STRAIGHT FLUSH');
        winningCards = hand.filter(card => isStraightFlushCard(card, hand));
      } else {
        setHoldIsMatch('STRAIGHT FLUSH');
      }
    }

    // Kiểm tra Four of a Kind
    else if (isFourOfAKind(hand)) {
      if (dealed) {
        setHandIsMatch('4 OF A KIND');
        winningCards = hand.filter(card => isFourOfAKindCard(card, hand));
      } else {
        setHoldIsMatch('4 OF A KIND');
      }
    }

    // Kiểm tra Full House
    else if (isFullHouse(hand)) {
      if (dealed) {
        setHandIsMatch('FULL HOUSE');
        winningCards = hand.filter(card => isFullHouseCard(card, hand));
      } else {
        setHoldIsMatch('FULL HOUSE');
      }
    }

    // Kiểm tra Flush
    else if (isFlush(hand)) {
      if (dealed) {
        setHandIsMatch('FLUSH');
        winningCards = hand.filter(card => isFlushCard(card, hand));
      } else {
        setHoldIsMatch('FLUSH');
      }
    }

    // Kiểm tra Straight
    else if (isStraight(hand)) {
      if (dealed) {
        setHandIsMatch('STRAIGHT');
        winningCards = hand.filter(card => isStraightCard(card, hand));
      } else {
        setHoldIsMatch('STRAIGHT');
      }
    }

    // Kiểm tra Three of a Kind
    else if (isThreeOfAKind(hand)) {
      if (dealed) {
        setHandIsMatch('3 OF A KIND');
        winningCards = hand.filter(card => isThreeOfAKindCard(card, hand));
      } else {
        setHoldIsMatch('3 OF A KIND');
      }
    }

    // Kiểm tra Two Pair
    else if (isTwoPair(hand)) {
      if (dealed) {
        setHandIsMatch('2 PAIR');
        winningCards = hand.filter(card => isTwoPairCard(card, hand));
      } else {
        setHoldIsMatch('2 PAIR');
      }
    }

    // Kiểm tra Jacks or Better
    else if (isJacksOrBetter(hand)) {
      if (dealed) {
        setHandIsMatch('PAIR OF JACK OR BETTER');
        winningCards = hand.filter(card => isJacksOrBetterCard(card));
      } else {
        setHoldIsMatch('PAIR OF JACK OR BETTER');
      }
    }

    // Không thuộc bộ bài thắng nào
    else {
      if (dealed) {
        setHandIsMatch('No Winning Hand');
      } else {
        setHoldIsMatch('No Winning Hand');
      }
    }

    setWinning(winningCards);
  };

  // Các hàm kiểm tra từng loại bộ bài thắng (tương tự)
  const isRoyalFlush = (hand: CardType[]) => {
    if (hand.length >= 5) {
      const ranks = ['A', 'K', 'Q', 'J', '10'];
      const suits = hand.map(card => card.suit);
      const allSameSuit = suits.every(suit => suit === suits[0]);
      const hasAllRanks = ranks.every(rank => hand.some(card => card.rank === rank));
      return allSameSuit && hasAllRanks;
    }
  };
  const isRoyalFlushCard = (card: CardType) => {
    const royalFlushRanks = ['A', 'K', 'Q', 'J', '10'];
    return royalFlushRanks.includes(card.rank);
  };

  const isStraightFlush = (hand: CardType[]) => {
    if (hand.length >= 5) {
      return isStraight(hand) && isFlush(hand);
    }
  };
  const isStraightFlushCard = (card: CardType, hand: CardType[]) => {
    // Giả sử hand đã được sắp xếp và kiểm tra trước đó để xác định bộ bài Straight Flush
    const suits = hand.map(c => c.suit);
    const ranks = hand.map(c => c.rank);

    // Kiểm tra tất cả các lá bài trong hand có cùng một suit
    const isSameSuit = suits.every(suit => suit === card.suit);
    if (!isSameSuit) return false;

    // Kiểm tra nếu card.rank là một trong các lá bài trong hand thuộc bộ bài Straight Flush
    const straightFlushRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cardIndex = straightFlushRanks.indexOf(card.rank);
    return cardIndex !== -1;
  };

  const isFourOfAKind = (hand: CardType[]) => {
    if (hand.length >= 4) {
      const rankCount: RankCountType = {};
      hand.forEach(card => {
        rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
      });
      return Object.values(rankCount).includes(4);
    }
  };
  const isFourOfAKindCard = (card: CardType, hand: CardType[]) => {
    // Đếm số lượng các lá bài có cùng rank
    const rankCount = hand.filter(c => c.rank === card.rank).length;
    return rankCount === 4;
  };

  const isFullHouse = (hand: CardType[]) => {
    if (hand.length >= 5) {
      const rankCount: RankCountType = {};
      hand.forEach(card => {
        rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
      });
      const values = Object.values(rankCount);
      return values.includes(3) && values.includes(2);
    }
  };
  const isFullHouseCard = (card: CardType, hand: CardType[]) => {
    const rankCounts = hand.reduce((acc, c) => {
      acc[c.rank] = (acc[c.rank] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const values = Object.values(rankCounts);
    return values.includes(3) && values.includes(2);
  };

  const isFlush = (hand: CardType[]) => {
    if (hand.length >= 5) {
      const suits = hand.map(card => card.suit);
      return suits.every(suit => suit === suits[0]);
    }
  };
  const isFlushCard = (card: CardType, hand: CardType[]) => {
    // Kiểm tra tất cả các lá bài trong hand có cùng một suit
    const suits = hand.map(c => c.suit);
    return suits.every(suit => suit === card.suit);
  };

  const isStraight = (hand: CardType[]) => {
    if (hand.length >= 5) {
      const ranks = 'A23456789TJQK';
      const handRanks = hand.map(card => card.rank === '10' ? 'T' : card.rank).sort((a, b) => ranks.indexOf(a) - ranks.indexOf(b));
      const startIndex = ranks.indexOf(handRanks[0]);
      return handRanks.every((rank, index) => ranks[startIndex + index] === rank);
    }
  };
  const isStraightCard = (card: CardType, hand: CardType[]) => {
    const ranks = hand.map(c => c.rank);
    const straightRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cardIndex = straightRanks.indexOf(card.rank);

    // Kiểm tra nếu card.rank có thể tạo thành một dãy liên tiếp trong hand
    const cardRankPosition = straightRanks.slice(cardIndex, cardIndex + 5);
    return cardRankPosition.every(rank => ranks.includes(rank));
  };

  const isThreeOfAKind = (hand: CardType[]) => {
    if (hand.length >= 3) {
      const rankCount: RankCountType = {};
      hand.forEach(card => {
        rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
      });
      return Object.values(rankCount).includes(3);
    }
  };
  const isThreeOfAKindCard = (card: CardType, hand: CardType[]) => {
    const rankCount = hand.filter(c => c.rank === card.rank).length;
    return rankCount === 3;
  };

  const isTwoPair = (hand: CardType[]) => {
    if (hand.length >= 4) {
      const rankCount: RankCountType = {};
      hand.forEach(card => {
        rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
      });
      const values = Object.values(rankCount);
      return values.filter(value => value === 2).length === 2;
    }
  };
  const isTwoPairCard = (card: CardType, hand: CardType[]) => {
    const rankCounts = hand.reduce((acc, c) => {
      acc[c.rank] = (acc[c.rank] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pairs = Object.values(rankCounts).filter(count => count === 2).length;
    return pairs === 2;
  };

  const isJacksOrBetter = (hand: CardType[]) => {
    if (hand.length >= 2) {
      const rankCount: RankCountType = {};
      hand.forEach(card => {
        rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
      });
      return ['J', 'Q', 'K', 'A'].some(rank => rankCount[rank] === 2);
    }
  };
  const isJacksOrBetterCard = (card: CardType) => {
    const jacksOrBetterRanks = ['J', 'Q', 'K', 'A'];
    return jacksOrBetterRanks.includes(card.rank);
  };

  useEffect(() => {
    form.setFieldsValue(formData)

    if (!dealed && hold.length > 0) {
      console.log('Holded!')
      onCheckHand(hold)
      console.log(holdIsMatch)
    }

    if (dealed && hand.length === 5) {
      console.log('Dealed!')
      onCheckHand(hand);
      console.log(handIsMatch)
      console.log('Winning Card:', winning)
    }
  }, [form, formData, hand, hold, dealed, holdIsMatch, handIsMatch]);

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
                        <Row gutter={4} key={i} className={`
                          ${holdIsMatch === e.name ? 'selected' : ''}
                          ${handIsMatch === e.name ? 'won' : ''}
                        `}>
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
                  <div className={`poker-hand ${dealed ? 'disabled' : ''}`}>
                    <Row gutter={8}>
                      {hand.length === 5
                        ? hand.map((e, i) =>
                          <Col flex="20%" key={i}>
                            <div className="poker-hand-card" onClick={() => onHoldCard(e)}>
                              <div className={`
                                poker-hand-card-inner 
                                ${hold.includes(e) ? 'selected' : ''}
                                ${winning.includes(e) ? 'won' : ''}
                                ${!hold.includes(e) && flipped ? 'flipped' : ''}
                              `}>
                                <div className="front">
                                  <span style={{ color: `${(e.suit == 'hearts' || e.suit == 'diamonds') ? '#f44336' : '#000'}` }}>
                                    {e.rank}
                                  </span>
                                  <Img src={`/card_${e.suit}.png`} />
                                  {hold.includes(e) ? <span className="hold">HOLD</span> : ''}
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
                        )
                        : [...Array(5)].map((e, i) =>
                          <Col flex="20%" key={i}>
                            <div className="poker-hand-card">
                              <div className={`poker-hand-card-inner flipped`}>
                                <div className="front">
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
                      !dealed
                        ? play
                          ? <Btn className="btn-modal" block><Img src="/loading.gif" /></Btn>
                          : <Btn className="btn-modal" block onClick={onDealing}>Deal</Btn>
                        : play
                          ? <Btn block><Img src="/loading.gif" /></Btn>
                          : <Btn block onClick={onStartPlaying}>BET</Btn>
                    }
                  </Col>
                  <Col span={6}></Col>
                </Row>

                <div className="form-group">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Bet Amount" name="betAmount" className={`${dealed ? '' : hand.length > 0 ? 'disabled' : ''}`}>
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