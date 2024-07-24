import { numberFormat } from "@util/common";
import { Table, Tabs } from "antd";
import type { TableProps } from "antd";
import { FC, ReactNode } from "react";
import { Icon } from "./Icon";

interface Props {
  dataSource?: object[]
}

interface TableBetsProps {
  columns?: object[],
  dataSource?: object[],
}

interface MyBetsType {
  time?: string
  game?: ReactNode
  bet?: number
  multiplier?: number
  profit?: number
}
interface AllBetsType {
  time?: string
  game?: ReactNode
  user?: string
  bet?: number
  multiplier?: number
  profit?: number
}

const TableBets: FC<TableBetsProps> = ({ columns, dataSource }) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      className="history-table"
    />
  )
}

const myBetsColumns: TableProps<MyBetsType>['columns'] = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  }, {
    title: 'Game',
    dataIndex: 'game',
    key: 'game',
  }, {
    title: 'Bet',
    dataIndex: 'bet',
    key: 'bet',
    render: (value) => <span>{numberFormat(value, 8)}</span>
  }, {
    title: 'Multiplier',
    dataIndex: 'multiplier',
    key: 'multiplier',
    render: (value) => <span className="history-table-multiplier">{numberFormat(value, 2)}x</span>
  }, {
    title: 'Profit',
    dataIndex: 'profit',
    key: 'profit',
    render: (value) => <span className={`${value > 0 ? 'history-table-positive' : 'history-table-negative'}`}>{numberFormat(value, 8)}x</span>
  },
]

const allBetsColumns: TableProps<AllBetsType>['columns'] = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  }, {
    title: 'Game',
    dataIndex: 'game',
    key: 'game',
  }, {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  }, {
    title: 'Bet',
    dataIndex: 'bet',
    key: 'bet',
    render: (value) => <span>{numberFormat(value, 8)}</span>
  }, {
    title: 'Multiplier',
    dataIndex: 'multiplier',
    key: 'multiplier',
    render: (value) => <span className="history-table-multipler">{numberFormat(value, 2)}x</span>
  }, {
    title: 'Profit',
    dataIndex: 'profit',
    key: 'profit',
    render: (value) => <span className={`${value < 0 ? 'table-table-positive' : 'table-table-negative'}`}>{numberFormat(value, 8)}x</span>
  },
]

const sample = [{
  time: '00:00:00',
  game: <span className="history-table-game">
    <Icon fill icon="diamond" size={14} />
    Gems
  </span>,
  bet: 0.00000100,
  multiplier: 1.46,
  profit: 0.00000146
}, {
  time: '00:00:00',
  game: <span className="history-table-game">
    <Icon fill icon="diamond" size={14} />
    Gems
  </span>,
  bet: 0.00000100,
  multiplier: 0.00,
  profit: -0.00000100
}]

export const BetHistory: FC<Props> = ({ dataSource }) => {
  return (
    <Tabs
      style={{ width: 'calc(100vw - 300px)' }}
      defaultActiveKey="1"
      className="history"
      items={[
        {
          label: 'MY BETS',
          key: '1',
          children: <TableBets columns={myBetsColumns} dataSource={sample} />
        },
        {
          label: 'ALL BETS',
          key: '2',
          children: <TableBets columns={allBetsColumns} dataSource={dataSource} />,
        },
      ]}
    />
  )
}