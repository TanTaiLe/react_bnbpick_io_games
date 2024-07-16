import { Button } from 'antd';
import { FC, ReactNode } from 'react';

interface Props {
  children?: ReactNode
  block?: boolean
  size?: string
  style?: object
  htmlType?: any
  vertical?: boolean
  iconOnly?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  // any props that come into the component
}

export const Btn: FC<Props> = ({ children, block, size, style, htmlType, vertical, iconOnly, onClick }) => {
  return (
    <Button
      className={`
      btn
      ${vertical && 'btn-vertical'}
      ${size && `btn--${size}`}
      ${iconOnly && 'btn-icon'}
    `}
      style={style}
      block={block}
      htmlType={htmlType}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}