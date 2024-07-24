import { Modal, Space } from "antd";
import { FC, useState } from "react";
import { Icon } from "./Icon";

export const GameInfo: FC = () => {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFairnessOpen, setIsFairnessOpen] = useState(false);


  const showModal = () => {
    setIsRulesOpen(true);
  };

  const handleCancel = () => {
    setIsRulesOpen(false);
  };

  return (
    <Space align="center" className="game-info" size="middle">
      <div onClick={showModal} className="game-info-item">
        <Icon fill icon="book" size={20} />
        Rules
      </div>
      <div onClick={showModal} className="game-info-item">
        <Icon fill icon="balance" size={20} />
        Fairness
      </div>
      <Modal
        className="modal"
        title={<span className="modal-title"><Icon fill icon="book" size={20} />Rules</span>}
        open={isRulesOpen}
        onCancel={handleCancel}
        footer={null}>
        <div className="modal-content">
          <ol>
            <li>Reveal mines to increase payout multiplier.</li>
            <li>Cash out at any point to win at the last recorded multiplier.</li>
            <li>Once a bomb is revealed the game is ended and wager is lost.</li>
            <li>Increase of configured bombs will increase multipliers on reveal.</li>
          </ol>
        </div>
      </Modal>
    </Space>
  )
}