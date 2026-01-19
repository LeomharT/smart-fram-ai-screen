import { deleteLinkedApp, getLinkedAppList } from '@/api/linked-app';
import TransparentCard from '@/components/TransparentCard';
import { MUTATIONS } from '@/constant/mutations';
import { QIERIES } from '@/constant/queries';
import type {
  ExecutionAction,
  LinkedAppFormValue,
  TirggerCondition,
} from '@/types/linked-app.type';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Badge,
  Button,
  Card,
  Flex,
  Space,
  Table,
  type TableProps,
} from 'antd';
import { useState } from 'react';
import LinkedAppForm from './components/LinkedAppForm';
import classes from './style.module.css';

const dateFormater = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

export default function LinkedApp() {
  const { modal, message } = App.useApp();

  const [open, setOpen] = useState(false);

  const [initialValue, setInitialValue] =
    useState<Partial<LinkedAppFormValue> | null>(null);

  const query = useQuery({
    queryKey: [QIERIES.LINKED_APP.LIST],
    queryFn: getLinkedAppList,
    initialData: [],
  });

  const mutation = useMutation({
    mutationKey: [MUTATIONS.LINKED_APP.DELETE],
    mutationFn: deleteLinkedApp,
    onSuccess() {
      message.success('应用删除成功');
      query.refetch();
    },
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
            <Button
              className={classes.action}
              danger
              size='small'
              type='link'
              onClick={() => {
                modal.confirm({
                  title: '删除联动应用',
                  content: `您确定要删除应用${record.linkageName}吗?`,
                  okText: '删除应用',
                  cancelText: '取消',
                  okButtonProps: {
                    danger: true,
                  },
                  onOk() {
                    return mutation.mutateAsync(record.id);
                  },
                });
              }}
            >
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

  function handleOnSuccess() {
    handleOnClose();
    message.success('应用数据提交成功');
    query.refetch();
  }

  return (
    <div className={classes.apps}>
      <LinkedAppForm
        open={open}
        initialValue={initialValue}
        onCancel={handleOnClose}
        onSuccess={handleOnSuccess}
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
            size='small'
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
