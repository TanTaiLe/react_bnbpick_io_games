import { Form, Input, Modal, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Btn } from "./Btn";

interface FieldType {
  nonce: number
  ssh: string
  clientSeed: string
}

const defaultValues = {
  nonce: 174,
  ssh: '6c49cfc0d208b65013ecffd81676f78151af28624799a1c05721f3b9678e79be',
  clientSeed: '76f79dc7a9d80cef'
}

const rulesModalContent = [
  {
    game: 'mines',
    content: (<ol>
      <li>Reveal mines to increase payout multiplier.</li>
      <li>Cash out at any point to win at the last recorded multiplier.</li>
      <li>Once a bomb is revealed the game is ended and wager is lost.</li>
      <li>Increase of configured bombs will increase multipliers on reveal.</li>
    </ol>)
  }
]

export const GameInfo: FC = () => {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFairnessOpen, setIsFairnessOpen] = useState(false);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FieldType>(defaultValues)

  useEffect(() => {
    form.setFieldsValue(formData)
  }, [])

  return (
    <Space align="center" className="game-info" size="middle">
      <div onClick={() => setIsRulesOpen(true)} className="game-info-item">
        <Icon fill icon="book" size={20} />
        Rules
      </div>
      <div onClick={() => setIsFairnessOpen(true)} className="game-info-item">
        <Icon fill icon="balance" size={20} />
        Fairness
      </div>


      <Modal
        className="modal"
        title={<span className="modal-title"><Icon fill icon="book" size={20} />Rules</span>}
        centered
        open={isRulesOpen}
        onCancel={() => setIsRulesOpen(false)}
        footer={null}>
        <div className="modal-content">
          {rulesModalContent[0].content}
        </div>
      </Modal>

      <Modal
        className="modal"
        title={<span className="modal-title"><Icon fill icon="balance" size={20} />Fairness</span>}
        centered
        open={isFairnessOpen}
        onCancel={() => setIsFairnessOpen(false)}
        footer={null}>
        <div className="modal-content form">
          <Form
            form={form}
            name="fairness"
            // initialValues={defaultValues}
            // onFinish={onStartPlaying}
            layout="vertical"
            autoComplete="off"
          >
            <Space size="middle" direction="vertical" style={{ width: '100%' }}>
              <Form.Item label="Nonce" name="nonce" className="disabled">
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    addonBefore={<Icon icon="numbers" size={20}></Icon>}
                    value={formData.nonce}
                  />
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Sever Seed Hash" name="ssh" className="disabled">
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    addonBefore={<Icon icon="code" size={20}></Icon>}
                    value={formData.ssh}
                  />
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Client Seed" name="clientSeed">
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    addonBefore={<Icon icon="tv" size={20}></Icon>}
                    value={formData.clientSeed}
                  />
                </Space.Compact>
              </Form.Item>
              <Btn block className="btn-modal" type="submit">CHANGE SEED CLIENT</Btn>
            </Space>
          </Form>
        </div>
      </Modal>
    </Space>
  )
}