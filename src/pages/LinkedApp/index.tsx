import { getLinkedAppList } from '@/api/linked-app';
import TransparentCard from '@/components/TransparentCard';
import { QIERIES } from '@/constant/queries';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Table, type TableProps } from 'antd';
import { useState } from 'react';
import LinkedAppForm from './components/LinkedAppForm';
import classes from './style.module.css';

export default function LinkedApp() {
  const [open, setOpen] = useState(true);

  const query = useQuery({
    queryKey: [QIERIES.LINKED_APP.LIST],
    queryFn: getLinkedAppList,
  });

  const columns: TableProps['columns'] = [
    { key: '1', title: '联动名称', dataIndex: '' },
    { key: '2', title: '触发条件', dataIndex: '2' },
    { key: '3', title: '执行动作', dataIndex: '2' },
    { key: '4', title: '创建时间', dataIndex: '2' },
    { key: '5', title: '状态', dataIndex: '2' },
    { key: 'actions', title: '操作', dataIndex: '' },
  ];

  return (
    <div className={classes.apps}>
      <LinkedAppForm open={open} onCancel={() => setOpen(false)} />
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
        <Table columns={columns} />
      </TransparentCard>
    </div>
  );
}
