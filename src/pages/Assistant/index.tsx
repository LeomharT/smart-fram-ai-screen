import BackBtn from '@/components/BackBtn';
import TransparentCard from '@/components/TransparentCard';
import type { BubbleItemType } from '@ant-design/x';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Chat from './components/Chat';
import Report from './components/Report';
import Sensors from './components/Sensors';
import { genItem } from './genItem';
import classes from './style.module.css';

export default function Assistant() {
  const navigate = useNavigate();

  const [items, setItems] = useState<BubbleItemType[]>([
    genItem(
      true,
      '您好, 我是新大陆农业大模型AI助手, 可以帮您解答农业问题, 分析作物状况并生成农事报告',
      { typing: false, key: 'init' },
    ),
  ]);

  const [active, setActive] = useState<'chat' | 'report'>('chat');

  return (
    <div className={classes.assistant}>
      <TransparentCard
        style={{ height: '100%' }}
        styles={{ body: { height: '100%', padding: 12 } }}
      >
        <BackBtn
          onBack={() => {
            if (active === 'chat') navigate('/');
            if (active === 'report') setActive('chat');
          }}
        />
        {active === 'chat' ? (
          <div className={classes.wrap}>
            <Chat
              items={items}
              setItems={setItems}
              onCheckReport={() => setActive('report')}
            />
            <Sensors />
          </div>
        ) : (
          <Report />
        )}
      </TransparentCard>
    </div>
  );
}
