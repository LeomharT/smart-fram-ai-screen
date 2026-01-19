import {
  deleteLinkedApp,
  getLinkedAppList,
  putLinkedApp,
} from '@/api/linked-app';
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
import { useSearchParams } from 'react-router';
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

  const [search, setSearch] = useSearchParams();

  const query = useQuery({
    queryKey: [QIERIES.LINKED_APP.LIST],
    queryFn: () => getLinkedAppList(location.search),
    initialData: {
      data: [],
      total: 0,
    },
  });

  const mutation = useMutation({
    mutationKey: [MUTATIONS.LINKED_APP.DELETE],
    mutationFn: deleteLinkedApp,
    onSuccess() {
      let page = Number(search.get('pageNum') ?? 1);
      if (query.data.data?.length === 1) {
        if (page !== 1) {
          page -= 1;
          setSearch((prev) => {
            prev.set('pageNum', page.toString());
            return prev;
          });
        }
      }
      message.success('应用删除成功');
      query.refetch();
    },
  });

  const put = useMutation({
    mutationKey: [MUTATIONS.LINKED_APP.PUT],
    mutationFn: putLinkedApp,
    onSuccess() {
      message.success('操作成功');
      query.refetch();
    },
  });

  const columns: TableProps['columns'] = [
    { key: 'linkageName', title: '联动名称', dataIndex: 'linkageName' },
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
              onClick={() => {
                const isEnabled = record.isEnabled ? 0 : 1;
                const text = record.isEnabled ? '停用' : '启用';
                const data = {
                  ...record,
                  executionAction: JSON.parse(record.executionAction),
                  triggerCondition: JSON.parse(record.triggerCondition),
                  isEnabled,
                } as LinkedAppFormValue;
                modal.confirm({
                  title: text + '该应用吗? ',
                  okText: text + '应用',
                  content: `您确定${text}该应用吗? `,
                  cancelText: '取消',
                  okButtonProps: {
                    danger: record.isEnabled ? true : false,
                  },
                  onOk() {
                    return put.mutateAsync(data);
                  },
                });
              }}
            >
              {record.isEnabled ? '停用' : '启用'}
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

  function handleOnPageChange(page: number, pageSize: number) {
    setSearch((prev) => {
      prev.set('pageNum', page.toString());
      prev.set('pageSize', pageSize.toString());
      return prev;
    });
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
            loading={query.isFetching}
            columns={columns}
            dataSource={query.data.data}
            pagination={{
              size: 'default',
              pageSize: 10,
              total: query.data.total,
              current: Number(search.get('pageNum') ?? 1),
              onChange: handleOnPageChange,
            }}
          />
        </Card>
      </TransparentCard>
    </div>
  );
}
