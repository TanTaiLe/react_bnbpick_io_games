import { Btn } from "@component/DesignSystem/Btn"
import { Img } from "@component/DesignSystem/Img"
import { Layout } from "@component/DesignSystem/Layout"
import { getRandomInRange, numberFormat } from "@util/common"
import { PLINKO_BET_MINIMUM, PLINKO_SETTINGS } from "@util/constant"
import { Card, Checkbox, Col, Form, Input, Row, Select, Space } from "antd"
import { useEffect, useRef, useState } from "react"
import Matter, { Engine, Render, Runner, Bodies, World, Events, Composite, Body } from "matter-js";

// Mở rộng kiểu Body để thêm thuộc tính multiplierValue
declare module "matter-js" {
  interface Body {
    multiplierValue?: number;
    hasCollided?: boolean
  }
}

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
const pinLines = PLINKO_SETTINGS.rows;
const pinSize = 5;
const pinGap = 56;
const ballSize = 18;
const ballElastity = 0.8;

const bottomLimit = 630; // Giới hạn đáy
const multiplierWidth = 46; // Chiều rộng của mỗi ô multiplier
const multiplierHeight = 32; // Chiều cao của mỗi ô multiplier
const startX = 117; // Vị trí X bắt đầu của các ô multiplier
const gap = 10; // Khoảng cách giữa các ô multiplier

let lastBallDropTime = Date.now(); // Thời gian lần cuối bóng được thả
const ballDropInterval = 750; // Khoảng thời gian giữa các lần thả bóng

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
  const [multiplier, setMultiplier] = useState<number[]>(PLINKO_SETTINGS.risk[0].multiplier)
  const [pinSets, setPinSets] = useState<Matter.Body[]>([])

  let balls = []; // Khởi tạo biến lưu trữ đối tượng ball
  let ballId = 0; // Biến đếm để tạo id duy nhất cho mỗi bóng

  useEffect(() => {
    form.setFieldsValue(formData)
    const { risk } = PLINKO_SETTINGS
    const multiplierOnRisk = risk.find(r => r.value === formData.risk)?.multiplier!
    setMultiplier(multiplierOnRisk)
  }, [form, formData])

  useEffect(() => {
    onUpdateMultipliers()
    onCreateMultipliers()
    onCreateBoundaries()

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
          90 + l * pinGap,
          pinSize,
          {
            isStatic: true,
          },
        );
        pins.push(pin);
      }
    }
    setPinSets(pins)

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

    const newBall = Bodies.circle(worldWidth / 2 - getRandomInRange(27, 28), 20, ballSize, {
      restitution: ballElastity, // Độ đàn hồi
      density: 0.2,     // Độ nặng
      friction: 0.05,    // Ma sát
      render: {
        fillStyle: '#005A98'
      }
    })

    newBall.id = ballId++; // Gán id cho bóng và tăng biến đếm
    World.add(engine.current.world, newBall);
    balls.push(newBall)



    console.log('play')
    // Sau khi bóng được tạo, lắng nghe sự kiện để kiểm tra khi bóng chạm đáy
    Events.on(engine.current, 'afterUpdate', onCheckBallPosition)
  }

  const onCheckBallPosition = () => {

    balls.forEach((ball, i) => {

      pinSets.forEach(pin => {
        // Kiểm tra xem bóng có chạm vào pin hay không
        const collisions = Matter.Query.collides(ball, [pin]);
        if (collisions.length > 0) {
          // Thay đổi viền pin sang màu xanh nhạt
          pin.render.strokeStyle = '#a0d2eb'; // Màu viền xanh nhạt
          pin.render.lineWidth = 20;           // Độ dày viền để làm rõ hiệu ứng

          // Đặt thời gian để pin trở lại màu ban đầu
          setTimeout(() => {
            pin.render.strokeStyle = '#000000'; // Viền trở về màu mặc định
            pin.render.lineWidth = 0;           // Độ dày viền trở về mặc định
          }, 150); // Giữ màu trong 200ms, có thể điều chỉnh
        }
      });

      Events.on(engine.current, 'collisionStart', function (event) {
        const pairs = event.pairs;

        pairs.forEach(pair => {
          const { bodyA, bodyB } = pair;

          // Kiểm tra xem một trong hai đối tượng có phải là multiplierBox không
          if (bodyA.multiplierValue || bodyB.multiplierValue) {
            const ballCap = bodyA.multiplierValue ? bodyB : bodyA; // Lấy bóng
            const multiplierBoxCap = bodyA.multiplierValue ? bodyA : bodyB; // Lấy multiplier


            // Nếu ball đã va chạm trước đó, bỏ qua
            if (ballCap.hasCollided) return;

            // Đánh dấu rằng ball đã va chạm
            ballCap.hasCollided = true;

            console.log(`Bóng đã chạm vào ô multiplier với giá trị: ${multiplierBoxCap.multiplierValue}`);

            // Xử lý logic khi bóng chạm vào ô multiplier (ví dụ: tính điểm)
            onStopPlaying()

            // Xóa bóng khỏi mảng sau khi nó chạm đáy để không kiểm tra lại
            balls.splice(i, 1);


            // Nếu không còn bóng nào, dừng lắng nghe sự kiện
            if (balls.length === 0) {
              Matter.Events.off(engine.current, 'afterUpdate', onCheckBallPosition);
            }
          }
        })
      })
    })
  }

  // Hàm tạo các ô multiplier
  const onCreateMultipliers = () => {
    multiplier.forEach((value, index) => {
      // Tính toán vị trí X của mỗi ô dựa trên chỉ số index
      const xPos = startX + index * (multiplierWidth + gap);

      // Tạo một ô multiplier hình chữ nhật
      const multiplierBox = Bodies.rectangle(
        xPos,
        bottomLimit,
        multiplierWidth,
        multiplierHeight,
        {
          isStatic: true, // Ô multiplier không di chuyển
          isSensor: true, // Ô multiplier có thể đi xuyên
          render: {
            fillStyle: 'transparent'
          }
        }
      );

      // Gán giá trị hệ số nhân vào đối tượng để có thể sử dụng sau này
      multiplierBox.multiplierValue = value;

      // Thêm ô multiplier vào thế giới của Matter.js
      World.add(engine.current.world, multiplierBox);
    });
  }

  // Hàm cập nhật giá trị cho các ô multiplier khi thay đổi độ khó
  const onUpdateMultipliers = () => {
    // Duyệt qua tất cả các ô multiplier đã tạo
    Composite.allBodies(engine.current.world).forEach(body => {
      if (body.multiplierValue !== undefined) {
        // Tìm chỉ số của ô multiplier dựa trên vị trí
        const index = (body.position.x - startX) / (multiplierWidth + gap);

        // Cập nhật giá trị multiplierValue mới từ mảng multiplier
        body.multiplierValue = multiplier[index];
      }
    });
  };

  const onCreateBoundaries = () => {
    // Thêm bức tường bên trái
    const leftWall = Bodies.rectangle(225, bottomLimit / 2, 1, bottomLimit - 78, {
      isStatic: true,
      render: {
        fillStyle: 'transparent'
      }
    });
    Body.rotate(leftWall, 0.465)

    // Thêm bức tường bên phải
    const rightWall = Bodies.rectangle(worldWidth - 280, bottomLimit / 2, 1, bottomLimit - 78, {
      isStatic: true,
      render: {
        fillStyle: 'transparent'
      }
    });
    Body.rotate(rightWall, -0.465)

    // Thêm các bức tường vào thế giới
    World.add(engine.current.world, [leftWall, rightWall]);
  };

  const onStopPlaying = () => {
    setPlay(false)
  }

  const onStartAutoBet = () => {
    setAutoPlay(true)
    lastBallDropTime = Date.now(); // Đặt lại thời gian khi bắt đầu

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();

      // Kiểm tra nếu đủ thời gian đã trôi qua kể từ lần thả bóng cuối
      if (currentTime - lastBallDropTime >= ballDropInterval) {
        onStartPlaying()
        lastBallDropTime = currentTime; // Cập nhật thời gian thả bóng
      }
    }, 100)
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

                  <div className="plinko-multiplier">
                    {multiplier.map((e, i) =>
                      <div key={i} className="plinko-multiplier-item">
                        {e}x
                      </div>
                    )}
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
                      <Form.Item label="Risk" name="risk" className={`${autoPlay ? 'disabled' : play && 'disabled'}`}>
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