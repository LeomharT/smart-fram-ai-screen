import BackBtn from '@/components/BackBtn';
import TransparentCard from '@/components/TransparentCard';
import { Flex } from 'antd';
import Chat from './components/Chat';
import Sensors from './components/Sensors';
import classes from './style.module.css';

export default function Assistant() {
  return (
    <div className={classes.assistant}>
      <BackBtn />
      <TransparentCard
        style={{ height: '100%' }}
        styles={{ body: { height: 'calc(100% - 24px)' } }}
      >
        <Flex orientation='vertical' gap={24} style={{ height: '100%' }}>
          <Sensors />
          <Chat />
        </Flex>
      </TransparentCard>
    </div>
  );
}
