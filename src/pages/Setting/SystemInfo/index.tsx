import { getSystemInfo } from '@/api/setting.api';
import { QUERIES } from '@/constant/queries';
import { useQuery } from '@tanstack/react-query';
import { Descriptions, Flex } from 'antd';
import type { DescriptionsProps } from 'antd/lib';

export default function SystemInfo() {
  const query = useQuery({
    queryKey: [QUERIES.SETTING.SYSTEM_INFO],
    queryFn: getSystemInfo,
  });

  const items: DescriptionsProps['items'] = [
    { key: '1', label: '版本信息', children: query.data?.application_version },
    { key: '2', label: 'SN码', children: query.data?.sn_code },
    { key: '3', label: '系统版本', children: query.data?.system_version },
    { key: '4', label: '处理器', children: query.data?.processor },
    { key: '5', label: '运行内存', children: query.data?.memory },
    { key: '6', label: '存储', children: query.data?.storage },
    { key: '7', label: 'AI引擎NPU', children: query.data?.npu_performance },
    { key: '8', label: 'GPU', children: query.data?.gpu_model },
  ];

  return (
    <Flex justify='center'>
      <Descriptions
        column={1}
        style={{ width: 328 }}
        title='系统信息'
        items={items}
      />
    </Flex>
  );
}
