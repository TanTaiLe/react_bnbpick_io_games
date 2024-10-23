import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { numberFormat } from "@util/common"
import { PLINKO_BET_MINIMUM, PLINKO_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Select, Space } from "antd"
import { useEffect, useRef, useState } from "react"
import Matter, { Engine, Render, Runner, Bodies, World, Events } from "matter-js";

interface FieldType {
  betAmount: number
  isAuto: boolean
  risk: string
};

const defaultValues = {
  betAmount: PLINKO_BET_MINIMUM,
  isAuto: false,
  risk: 'low'
}

const worldWidth = 850;
const startPins = 3;
const pinLines = 10;
const pinSize = 5;
const pinGap = 56;
const ballSize = 16;
const ballElastity = 0.75;

export const Plinko = () => {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<FieldType>(defaultValues)
  const [play, setPlay] = useState<boolean | undefined>()
  const [autoPlay, setAutoPlay] = useState<boolean | undefined>()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  // create an scene
  const scene = useRef<HTMLDivElement>(null)
  // create an engine
  const engine = useRef(Engine.create())

  let balls = []; // Khởi tạo biến lưu trữ đối tượng ball
  let ballId = 0; // Biến đếm để tạo id duy nhất cho mỗi bóng
  const bottomLimit = 630; // Giới hạn đáy


  useEffect(() => {
    engine.current

    // create a renderer
    const render = Render.create({
      element: scene.current!,
      engine: engine.current,
      options: {
        wireframes: false,
        height: 650,
        background: 'transparent'
      }
    });

    const pins: Matter.Body[] = [];
    for (let l = 0; l < pinLines; l++) {
      const linePins = startPins + l;
      const lineWidth = linePins * pinGap;
      for (let i = 0; i < linePins; i++) {
        const pin = Bodies.circle(
          worldWidth / 2 - lineWidth / 2 + i * pinGap,
          100 + l * pinGap,
          pinSize,
          {
            isStatic: true,
          },
        );
        pins.push(pin);
      }
    }
    World.add(engine.current.world, pins);

    Render.run(render);

    // create runner
    var runner = Runner.create();
    // run the engine
    Runner.run(runner, engine.current);


    return () => {
      // destroy Matter
      Render.stop(render)
      World.clear(engine.current.world, true)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}


    }
  }, []);


  const onStartPlaying = () => {
    setPlay(true)

    const newBall = Bodies.circle(worldWidth / 2, 0, ballSize, {
      restitution: ballElastity,
      render: {
        fillStyle: '#005A98'
      }
    });
    newBall.id = ballId++; // Gán id cho bóng và tăng biến đếm
    World.add(engine.current.world, newBall);
    balls.push(newBall);



    console.log('play')
    // Sau khi bóng được tạo, lắng nghe sự kiện để kiểm tra khi bóng chạm đáy
    Events.on(engine.current, 'afterUpdate', checkBallPosition);
  }

  const checkBallPosition = () => {

    balls.forEach((ball, i) => {
      if (ball.position.y >= bottomLimit) {
        console.log(`Bóng ${ball.id + 1} đã chạm đáy!`);

        // Thực hiện hành động khi bóng chạm đáy, ví dụ như dừng bóng
        // Matter.Body.setStatic(ball, true); // Dừng bóng lại
        onStopPlaying()

        // Xóa bóng khỏi mảng sau khi nó chạm đáy để không kiểm tra lại
        balls.splice(i, 1);

        // Nếu không còn bóng nào, dừng lắng nghe sự kiện
        if (balls.length === 0) {
          Matter.Events.off(engine.current, 'afterUpdate', checkBallPosition);
        }
      }
    })
  }

  const onStopPlaying = () => {
    setPlay(false)
  }

  const onStartAutoBet = () => {
    setAutoPlay(true)
    intervalRef.current = setInterval(() => {
      onStartPlaying()
    }, 1500)
  }

  const onStopAutoBet = () => {
    setAutoPlay(false)
    console.log(intervalRef.current)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
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
    if (newValue && newValue >= PLINKO_BET_MINIMUM)
      setFormData(prevValue => ({
        ...prevValue,
        'betAmount': newValue
      }))
  }


  return (
    <Layout title="Plinko">
      <Row style={{ width: '100%' }} justify='center'>
        <Col xl={{ span: 9 }}>
          <Card className="card form">
            <Form
              name="plinko"
              layout="vertical"
              initialValues={formData ? defaultValues : formData}
              form={form}
              autoComplete="off"
            >
              <Space size="middle" direction="vertical" style={{ width: '100%' }}>

                <div className="playground plinko">
                  <div ref={scene!}></div>
                  {/* ... */}
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

                <div className={`form-group ${autoPlay ? 'disabled' : play ? 'disabled' : ''}`}>
                  <Row gutter={16}>
                    <Col sm={{ span: 16 }} xs={{ span: 24 }}>
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
                    <Col sm={{ span: 8 }} xs={{ span: 24 }}>
                      <Form.Item label="Risk" name="risk" className={`${play && 'disabled'}`}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Select
                            defaultValue={defaultValues.risk}
                            style={{ width: 120 }}
                            onChange={e => onChange('risk', e)}
                            options={PLINKO_SETTINGS.risk}
                          />
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