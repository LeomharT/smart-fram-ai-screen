import { getSensorData } from '@/api/assistant.api';
import Loader from '@/components/Loader';
import { QUERIES } from '@/constant/queries';
import { useQuery } from '@tanstack/react-query';
import { Image, Space, Typography } from 'antd';
import classes from './style.module.css';
import co2 from '/assets/imgs/icons/co2.svg?url';
import pm25 from '/assets/imgs/icons/PM2.5.svg?url';
import tvoc from '/assets/imgs/icons/tvoc.svg?url';
import light from '/assets/imgs/icons/光照强度.svg?url';
import pressure from '/assets/imgs/icons/大气压强.svg?url';
import temp from '/assets/imgs/icons/温度.svg?url';
import wet from '/assets/imgs/icons/湿度.svg?url';

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
    refetchInterval: 5000,
  });

  const items = [
    {
      key: 'co2',
      lable: 'CO2',
      ...query.data?.CO2,
      icon: co2,
    },
    {
      key: 'PM2.5',
      lable: 'PM2.5',
      ...query.data?.['PM2.5'],
      icon: pm25,
    },
    {
      key: 'TVOC',
      lable: 'TVOC',
      ...query.data?.TVOC,
      icon: tvoc,
    },
    {
      key: '光照强度',
      lable: '光照强度',
      ...query.data?.光照强度,
      icon: light,
    },
    {
      key: '大气压强',
      lable: '大气压强',
      ...query.data?.大气压强,
      icon: pressure,
    },
    {
      key: '温度',
      lable: '温度',
      ...query.data?.温度,
      icon: temp,
    },
    {
      key: '湿度',
      lable: '湿度',
      ...query.data?.湿度,
      icon: wet,
    },
  ];

  return (
    <Loader spinning={query.isPending} classNames={{ wrapper: classes.loader }}>
      <div className={classes.list}>
        {items.map((i) => (
          <div key={i.key} className={classes.item}>
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
          </div>
        ))}
      </div>
    </Loader>
  );
}
