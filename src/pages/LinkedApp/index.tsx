import { getLinkedAppList } from '@/api/linked-app';
import TransparentCard from '@/components/TransparentCard';
import { QIERIES } from '@/constant/queries';
import type {
  ExecutionAction,
  LinkedAppFormValue,
  TirggerCondition,
} from '@/types/linked-app.type';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Card, Flex, Space, Table, type TableProps } from 'antd';
import { useState } from 'react';
import LinkedAppForm from './components/LinkedAppForm';
import classes from './style.module.css';

const dateFormater = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

export default function LinkedApp() {
  const [open, setOpen] = useState(false);

  const [initialValue, setInitialValue] =
    useState<Partial<LinkedAppFormValue> | null>(null);

  const query = useQuery({
    queryKey: [QIERIES.LINKED_APP.LIST],
    queryFn: getLinkedAppList,
    initialData: [],
  });

  const columns: TableProps['columns'] = [
    { key: 'linkageName1', title: '联动名称', dataIndex: 'linkageName' },
    {
      key: 'triggerCondition',
      title: '触发条件',
      dataIndex: 'triggerCondition',
      render(value) {
        const json: TirggerCondition[] = JSON.parse(value);
        return (
          <span>
            {json
              .map((item) => item.property + item.operator + item.value)
              .join(', ')}
          </span>
        );
      },
    },
    {
      key: 'executionAction',
      title: '执行动作',
      dataIndex: 'executionAction',
      render(value) {
        const json: ExecutionAction[] = JSON.parse(value);
        return (
          <span>
            {json
              .map(
                (item) => item.property + ': ' + (item.value ? '开启' : '关闭'),
              )
              .join(', ')}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      title: '创建时间',
      dataIndex: 'createdAt',
      render(value) {
        return dateFormater.format(new Date(value));
      },
    },
    {
      key: 'isEnabled',
      title: '状态',
      dataIndex: 'isEnabled',
      render: (value) =>
        value ? (
          <Badge status='success' text='开启' />
        ) : (
          <Badge status='error' text='停止' />
        ),
    },
    {
      key: 'actions',
      title: '操作',
      dataIndex: '',
      render(_, record) {
        return (
          <Space>
            <Button
              className={classes.action}
              size='small'
              variant='link'
              color='primary'
              onClick={() => {
                const selected = {
                  ...record,
                  executionAction: JSON.parse(record.executionAction),
                  triggerCondition: JSON.parse(record.triggerCondition),
                };
                setInitialValue(selected);
                setOpen(true);
              }}
            >
              配置
            </Button>
            <Button
              className={classes.action}
              size='small'
              variant='link'
              color='primary'
            >
              停用
            </Button>
            <Button className={classes.action} danger size='small' type='link'>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  function handleOnClose() {
    setOpen(false);
    setInitialValue(null);
  }

  return (
    <div className={classes.apps}>
      <LinkedAppForm
        open={open}
        initialValue={initialValue}
        onCancel={handleOnClose}
      />
      <TransparentCard style={{ height: '100%' }}>
        <Flex wrap='nowrap' gap={16}>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            添加
          </Button>
        </Flex>
        <br />
        <Card>
          <Card.Meta title='联动应用' />
          <br />
          <Table
            rowKey='id'
            size='middle'
            columns={columns}
            dataSource={query.data}
            pagination={{
              size: 'default',
            }}
          />
        </Card>
      </TransparentCard>
    </div>
  );
}
