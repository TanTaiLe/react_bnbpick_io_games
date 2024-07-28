import { Btn } from "@component/DesignSystem/Btn";
import { Icon } from "@component/DesignSystem/Icon";
import { Img } from "@component/DesignSystem/Img";
import { Layout } from "@component/DesignSystem/Layout"
import useStateCallback from "@hook/common/useStateCallback";
import { numberFormat } from "@util/common";
import { MINES_BET_MINIMUM, MINES_SETTINGS } from "@util/constant";
import { Card, Checkbox, Col, Form, Input, Row, Select, Space } from "antd"
import { useEffect, useRef, useState } from "react";

interface FieldType {
  betAmount: number
  mines: number
  isAuto: boolean
}

const defaultValues = {
  betAmount: MINES_BET_MINIMUM,
  mines: 3,
  isAuto: false
}

export const Mines = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const [isChosen, setIsChosen] = useState(Array(25).fill(0))
  const [mines, setMines] = useState<number[]>([])
  const [tileCount, setTileCount] = useState(0)
  const [tileAutoSet, setTileAutoSet] = useState<number[]>([])
  const [minesUpdated, setMinesUpdated] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [gameReset, setGameReset] = useState<boolean>(false);
  const [session, setSession] = useStateCallback<{
    multiplier: number
    multiplierPerTile: number
    profit: number
  }>({
    multiplier: 1,
    multiplierPerTile: 0,
    profit: 0.00000000
  })

  const onStartPlaying = () => {
    setPlay(true);
    onRandomMines(formData.mines);
    setIsChosen(Array(25).fill(0))
    setTileCount(0)
    setSession({
      multiplier: 1,
      multiplierPerTile: 0,
      profit: 0.00000000
    })
  }

  const onStartAutoBet = () => {
    setAutoPlay(true)
    setTimeout(() => setIsChosen(Array(25).fill(1)), 1000)
  }

  const onStopAutoBet = () => {
    console.log('Stopping auto bet...');
    setAutoPlay(false)
    setTimeout(() => setIsChosen(Array(25).fill(0)), 1000)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onStopPlaying()
  }

  const onRandomMines = (mineNum: number) => {
    let sets = []
    while (true) {
      sets = Array.from({ length: 25 }, () => Math.round(Math.random()));

      // Kiểm tra số lượng số 0 trong mảng
      const zeroCount = sets.filter(num => num === 0).length;
      if (zeroCount === mineNum) {
        break;
      }
    }
    setMines(sets)
    setMinesUpdated(true); // Đánh dấu rằng mines đã được cập nhật
  }

  const onCheckTileAutoSet = () => {
    for (const i of tileAutoSet) {
      console.log('mines', mines)
      console.log('i', i)
      if (mines[i] === 0) {
        onStopAutoBet();
        break;
      }
    }
  }

  const onChange = (name: string, value: any) => {
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }))

    name == 'isAuto' && onResetGame()
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
    if (newValue && newValue >= MINES_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }

  const onResetGame = () => {
    setMines([])
    setIsChosen(Array(25).fill(0))
    setTileAutoSet([])
    setSession({
      multiplier: 1,
      multiplierPerTile: 0,
      profit: 0.00000000
    })
    setGameReset(true) // đánh dấu game reset
  }

  const onTilePress = (multiplier: number, multiplierPerTile: number, tileId: number) => {
    if (formData.betAmount) {
      if (mines[tileId] == 1) {
        setIsChosen(prev => prev.map((e, i) => (i === tileId ? 1 : e)))
        setSession({
          multiplier: (session.multiplier == 1 ? MINES_SETTINGS[formData.mines - 1].multiplier : session.multiplier) + (session.multiplier == 1 ? 0 : multiplierPerTile),
          multiplierPerTile: multiplierPerTile,
          profit: formData.betAmount * (multiplier + multiplierPerTile * tileCount) - formData.betAmount
        })
        setTileCount(prev => prev + 1)
      } else {
        setIsChosen(Array(25).fill(1))
        setSession({
          multiplier: 0,
          multiplierPerTile: 0,
          profit: formData.betAmount * -1
        }, () => onStopPlaying())
      }
    }
  }

  const onTileChange = (tileId: number) => {
    setTileAutoSet(prev => {
      if (prev.includes(tileId))
        return prev.filter(tile => tile !== tileId)
      else
        return [...prev, tileId]
    })
  }

  const onStopPlaying = () => {
    setPlay(false)
    // onSaveRecord()
  }

  const onCashOut = () => {
    // onStopPlaying();
    onResetGame()
  }

  useEffect(() => {
    form.setFieldsValue(formData)
    formData.isAuto && setPlay(true)
    if (!play && play != undefined) {
      // console.log(record)
      // onSaveRecord()
    }

    console.log('play', play)

    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        onRandomMines(formData.mines)
      }, 1000)
    }

    if (gameReset) {
      onStopPlaying()
      setGameReset(false) // Reset lại trạng thái
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

  }, [form, formData, play, autoPlay, gameReset])

  useEffect(() => {
    if (minesUpdated) {
      onCheckTileAutoSet();
      setMinesUpdated(false); // Reset lại trạng thái
    }
  }, [mines, minesUpdated]);

  return (
    <Layout title="Mines">
      <Col md={{ span: 8 }}>
        <Card className="card form mines">
          <Form
            form={form}
            name="gems"
            initialValues={defaultValues}
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
                            defaultValue={defaultValues.mines}
                            style={{ width: 120 }}
                            onChange={e => onChange('mines', e)}
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
                            value={25 - formData.mines}
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
                    <Form.Item label={`Profit On Next Tile (${numberFormat(MINES_SETTINGS[formData.mines - 1].multiplier + MINES_SETTINGS[formData.mines - 1].multiplierPerTile * tileCount, 2)}x)`} name="nextProfit" className="disabled">
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                          value={numberFormat(formData?.betAmount * (MINES_SETTINGS[formData.mines - 1].multiplier + MINES_SETTINGS[formData.mines - 1].multiplierPerTile * tileCount) - formData?.betAmount, 8)}
                          disabled
                        />
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={`Total Profit (${numberFormat(session.multiplier, 2)}x)`} name="totalProfit" className="disabled">
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          prefix={<Img src="/coin_logo.svg" w={20} h={20} />}
                          value={numberFormat(session.profit, 8)}
                          disabled
                        />
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className={`playground ${!play ? 'not-allowed' : ''}`} style={{ marginTop: '-10px' }}>
                <Row gutter={8}>
                  {[...Array(25)].map((e, i) =>
                    <Col flex="20%" key={e}>
                      {
                        formData.isAuto
                          ? <Btn className={`tile ${isChosen[i] == 1 && 'showed'} ${formData.isAuto && 'auto'} ${tileAutoSet.includes(i) && 'checked'}`}
                            onClick={() => onTileChange(i)}
                          >
                            <div className="tile-front"></div>
                            <div className="tile-back">
                              <Img src={`${(isChosen[i] == 1 && mines[i]) ? '/mines_gem.png' : '/mines_mine.png'}`} w={40} />
                            </div>
                          </Btn>
                          : <Btn className={`tile ${isChosen[i] == 1 && 'showed'}`}
                            onClick={() => onTilePress(MINES_SETTINGS[formData.mines - 1].multiplier, MINES_SETTINGS[formData.mines - 1].multiplierPerTile, i)}
                          >
                            <div className="tile-front"></div>
                            <div className="tile-back">
                              <Img src={`${(isChosen[i] == 1 && mines[i]) ? '/mines_gem.png' : '/mines_mine.png'}`} w={40} />
                            </div>
                          </Btn>
                      }
                    </Col>
                  )}
                </Row>
              </div>

              <Row gutter={16} align="middle">
                <Col span={5}>
                  <Checkbox
                    onChange={e => onChange('isAuto', e.target.checked)}
                    // className={`${autoPlay ? 'disabled' : play ? 'disabled' : ''}`}
                    className={`${formData.isAuto
                      ? autoPlay
                        ? 'disabled'
                        : play
                          ? ''
                          : 'disabled'
                      : play
                        ? 'disabled'
                        : ''
                      }`}>Auto</Checkbox>
                </Col>
                <Col span={14}>
                  {
                    formData.isAuto
                      ? autoPlay
                        ? <Btn block onClick={onStopAutoBet}>STOP AUTO BET</Btn>
                        : <Btn block onClick={onStartAutoBet} className={`${tileAutoSet.length < 1 && 'disabled'}`}>START AUTO BET</Btn>
                      : play
                        ? <Btn block onClick={onCashOut} className={`btn-cashout ${isChosen.includes(1) ? '' : (play && 'disabled')}`}>CASHOUT</Btn>
                        : <Btn block onClick={onStartPlaying}>BET</Btn>
                  }
                </Col>
                <Col span={5}>
                </Col>
              </Row>
            </Space>
          </Form>
        </Card>
      </Col>
    </Layout>
  )
}