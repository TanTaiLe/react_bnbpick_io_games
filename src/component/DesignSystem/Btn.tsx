import { Button } from 'antd';
import { FC, ReactNode } from 'react';

interface Props {
  children?: ReactNode
  block?: boolean
  style?: object
  type?: any
  htmlType?: any,
  vertical?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  // any props that come into the component
}

export const Btn: FC<Props> = ({ children, block, style, type, htmlType, vertical, onClick }) => {
  return (
    <Button
      className={`
      btn
      ${vertical && 'btn-vertical'}
      ${type == 'text' && 'btn-text'}
    `}
      style={style}
      block={block}
      type={type}
      htmlType={htmlType}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}