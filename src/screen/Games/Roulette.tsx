import { Btn } from "@component/DesignSystem/Btn"
import { Icon } from "@component/DesignSystem/Icon"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { ROULETTE_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Space } from "antd"
import { useEffect, useRef, useState } from "react"
import { RouletteTable, RouletteWheel } from 'react-casino-roulette';
import { IRouletteWheelProps } from "react-casino-roulette/dist/components/RouletteWheel"
import 'react-casino-roulette/dist/index.css';

interface FieldType {
  betAmount: number
  isAuto: boolean
};

interface BetType {
  value: number
  img: string
}

interface HistoryType {
  id: number
  icon: string
  value: number
}


const defaultValues = {
  betAmount: 0,
  isAuto: false
}


export const Roulette = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean>(false)
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [currentChip, setCurrentChip] = useState<BetType>()
  const [bets, setBets] = useState({});
  const [betHistory, setBetHistory] = useState<HistoryType[]>([]);
  const [gameHistory, setGameHistory] = useState<string[]>([])
  const [resultBet, setResultBet] = useState<string>('-1');
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleBet = (betData: any) => {
    const { id } = betData; //lấy id của ô
    console.log(`You bet ${currentChip?.value} on`, betData)

    if (currentChip) {
      setBets(prev => ({
        ...prev,
        [id]: {
          icon: currentChip?.img,
        },
      }))
      setBetHistory((prev) => [...prev, { id, icon: currentChip.img, value: currentChip.value }]);
      setFormData(prev => ({
        ...prev,
        betAmount: prev.betAmount + currentChip?.value * 0.00000001
      }))
    }
  };

  const onStartPlaying = (): any => {
    setPlay(true)
    const { wheelValues } = ROULETTE_SETTINGS
    let result = wheelValues[Math.floor(Math.random() * wheelValues.length)]
    console.log(result)
    setResultBet(result); //random

    betHistory.map(e => {
      if (onCheckResult(parseInt(result), e.id.toString())) {
        console.log(`Bet ID: ${e.id} - You win!`);
      } else {
        console.log(`Bet ID: ${e.id} - You lose.`);
      }
    })

    setTimeout(() => {
      onStopPlaying()
      setGameHistory(prev => [
        ...prev,
        result
      ])
    }, 3000)
  }

  const onCheckResult = (result: number, id: string) => {
    if (id === result.toString()) return true;
    if (id === '1_TO_18' && result >= 1 && result <= 18) return true;
    if (id === '19_TO_36' && result >= 19 && result <= 36) return true;
    if (id === 'EVEN' && result % 2 === 0) return true;
    if (id === 'ODD' && result % 2 !== 0) return true;
    if (id === 'RED' && ROULETTE_SETTINGS.tile.red.includes(result)) return true;
    if (id === 'BLACK' && ROULETTE_SETTINGS.tile.black.includes(result)) return true;
    if (id === '1ST_DOZEN' && result >= 1 && result <= 12) return true;
    if (id === '2ND_DOZEN' && result >= 13 && result <= 24) return true;
    if (id === '3RD_DOZEN' && result >= 25 && result <= 36) return true;
    if (id === '1ST_COLUMN' && result % 3 === 1) return true;
    if (id === '2ND_COLUMN' && result % 3 === 2) return true;
    if (id === '3RD_COLUMN' && result % 3 === 0) return true;

    // Check for specific bet formats like [xx-yy-zz--...]
    if (id.includes('-')) {
      const numbers = id.split('-').map(Number);
      if (numbers.includes(result)) return true;
    }

    return false;
  }

  const onStopPlaying = () => {
    setPlay(false)
  }

  const onChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onChipSelect = (bet: BetType) => setCurrentChip(bet)

  const onStartAutoBet = () => {
    setAutoPlay(true)
  }
  const onStopAutoBet = () => {
    setAutoPlay(false)
  }

  const onUndo = () => {
    if (betHistory.length === 0) {
      console.error('Nothing to undo');
      return;
    }

    setBets((prevState) => {
      const state = JSON.parse(JSON.stringify(prevState));

      const lastBet = betHistory[betHistory.length - 1];
      const prevIcon = betHistory[betHistory.length - 2]?.icon;

      const { id: lastBetId, value } = lastBet;

      if (state[lastBetId].number === 1) {
        delete state[lastBetId];
        return state;
      }

      state[lastBetId].icon = prevIcon;
      state[lastBetId].number -= value;

      return state;
    });

    setBetHistory((prevState) => prevState.slice(0, -1));
  };

  const onClear = () => {
    setBetHistory([]);
    setBets({});
  };

  useEffect(() => {
    console.log('Bet history:', betHistory)

    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        onStartPlaying()
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [betHistory])

  return (

    <Layout title="Roulette">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 16 }}>
          <Card className="card form">

            <Form
              name="limbo"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                <Row gutter={16}>

                  <Space size="small" direction="vertical" style={{ width: '100%' }}>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Total Bet" name="betAmount" className="disabled">
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                            value={numberFormat(formData.betAmount, 8)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item<FieldType> label="Game History" className="disabled">
                        <Space size="small" align="center">
                          {gameHistory.map((e, i) =>
                            <div className={`
                              roulette-history
                              ${ROULETTE_SETTINGS.tile.red.includes(parseInt(e)) ? 'red' : ''}
                              ${(e == "0" || e == "00" ? 'zero' : '')}
                              `} key={i}>{e}</div>
                          )}
                        </Space>
                      </Form.Item>
                    </Col>
                  </Space>
                </Row>

                <div className="playground roulette">
                  <Row align="middle" gutter={[0, 16]}>
                    <Col span={12}>
                      <div className="roulette-wheel">
                        <RouletteWheel
                          start={play}
                          winningBet={resultBet}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={`roulette-table ${currentChip ? '' : 'not-allowed'}`}>
                        <RouletteTable bets={bets} onBet={handleBet} />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="roulette-chip">
                        {ROULETTE_SETTINGS.chips.map((e, i) =>
                          <div
                            key={i}
                            className={`roulette-chip-wrapper ${currentChip?.value == e.value ? 'selected' : ''}`}
                            onClick={() => onChipSelect(e)}
                          >
                            <Img src={e.img} />
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
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
                          : <Btn block onClick={onStartAutoBet} className={betHistory.length > 0 ? '' : 'disabled'}>AUTO SPIN</Btn>
                        : play
                          ? <Btn block className="disabled"><Img src="/loading.gif" /></Btn>
                          : <Btn block onClick={onStartPlaying} className={betHistory.length > 0 ? '' : 'disabled'}>SPIN</Btn>
                    }
                  </Col>
                  <Col span={6}>
                    <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                      <Space size="middle" align="center">
                        <Btn
                          className="btn-text"
                          style={{ gap: 0 }}
                          onClick={onUndo}>
                          <Icon icon="undo" size={20} />
                          Undo
                        </Btn>
                        <Btn
                          className="btn-text btn-text-red"
                          style={{ gap: 0 }}
                          onClick={onClear}><Icon icon="close" size={20} />
                          Clear
                        </Btn>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}