import BackBtn from '@/components/BackBtn';
import TransparentCard from '@/components/TransparentCard';
import { Button, Card, Flex } from 'antd';
import { useState } from 'react';
import LocalNetwork from './LocalNetwork';
import NetworkConfig from './NetworkConfig';
import classes from './style.module.css';
import SystemInfo from './SystemInfo';
import WebCam from './WebCam';
import cardbg from '/assets/imgs/cardbg.png?url';

const items = [
  { key: 'localNetwork', label: '本地设置' },
  { key: 'network', label: '网络服务配置' },
  { key: 'webcam', label: '网络摄像头' },
  { key: 'systemInfo', label: '系统信息' },
];

export default function Setting() {
  const [active, setActive] = useState('webcam');

  return (
    <div className={classes.setting}>
      <BackBtn />
      <TransparentCard
        style={{ height: '100%' }}
        styles={{ body: { height: '100%' } }}
      >
        <TransparentCard
          styles={{ body: { padding: 0 } }}
          style={{ background: 'transparent', marginBottom: 24 }}
        >
          <Flex wrap='nowrap'>
            {items.map((item) => (
              <Button
                key={item.key}
                type={active === item.key ? 'primary' : 'default'}
                ghost={active !== item.key}
                block
                style={{ border: 'none' }}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </Flex>
        </TransparentCard>
        <Card
          style={{
            height: 'calc(100% - 34px - 24px)',
            backgroundImage: `url(${cardbg})`,
          }}
        >
          {active === 'localNetwork' && <LocalNetwork />}
          {active === 'network' && <NetworkConfig />}
          {active === 'webcam' && <WebCam />}
          {active === 'systemInfo' && <SystemInfo />}
        </Card>
      </TransparentCard>
    </div>
  );
}
