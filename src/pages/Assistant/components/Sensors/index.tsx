import { getSensorData } from '@/api/assistant.api';
import Loader from '@/components/Loader';
import { QUERIES } from '@/constant/queries';
import { useQuery } from '@tanstack/react-query';
import { Card, Flex, Image, Space, Typography } from 'antd';
import ahumidity from '/assets/imgs/icons/ahumidity.svg?url';
import atemp from '/assets/imgs/icons/atemp.svg?url';

export default function Sensors() {
  const query = useQuery({
    queryKey: [QUERIES.ASSISTANT.SENSOR],
    queryFn: getSensorData,
    initialData: {
      CO2: { value: 0, unit: '' },
      'PM2.5': { value: 0, unit: '' },
      TVOC: { value: 0, unit: '' },
      光照强度: { value: 0, unit: '' },
      大气压强: { value: 0, unit: '' },
      温度: { value: 0, unit: '' },
      湿度: { value: 0, unit: '' },
    },
  });

  const items = [
    {
      key: 'atemp',
      lable: '大气温度',
      ...query.data?.温度,
      icon: atemp,
    },
    {
      key: 'ahumidity',
      lable: '大气湿度',
      ...query.data?.湿度,
      icon: ahumidity,
    },
    {
      key: 'ahumidity1',
      lable: '大气湿度',
      ...query.data?.湿度,
      icon: ahumidity,
    },
  ];

  return (
    <Loader spinning={query.isFetching}>
      <Flex wrap='nowrap' justify='space-between' gap={16}>
        {items.map((i) => (
          <Card key={i.key} style={{ background: 'transparent', flex: 1 }}>
            <Space>
              <Image preview={false} src={i.icon} />
              <Space orientation='vertical' size={0}>
                <Typography.Title
                  level={3}
                  style={{ color: 'white', margin: 0 }}
                >
                  {`${i.value}${i.unit}`}
                </Typography.Title>
                <Typography.Text style={{ color: 'white' }}>
                  {i.lable}
                </Typography.Text>
              </Space>
            </Space>
          </Card>
        ))}
      </Flex>
    </Loader>
  );
}
