import TransparentCard from '@/components/TransparentCard';
import { Button, Flex } from 'antd';
import { useState } from 'react';
import classes from './style.module.css';

const items = [
  { key: 'localSetting', label: '本地设置' },
  { key: 'network', label: '网络服务配置' },
  { key: 'LLMConfig', label: '农业大模型助手配置' },
  { key: 'system', label: '系统信息' },
];

export default function Setting() {
  const [active, setActive] = useState('localSetting');

  return (
    <div className={classes.setting}>
      <TransparentCard style={{ height: '100%' }}>
        <TransparentCard
          styles={{ body: { padding: 0 } }}
          style={{ background: 'transparent' }}
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
      </TransparentCard>
    </div>
  );
}
