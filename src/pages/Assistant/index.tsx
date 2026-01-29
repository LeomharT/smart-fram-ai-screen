import BackBtn from '@/components/BackBtn';
import TransparentCard from '@/components/TransparentCard';
import Chat from './components/Chat';
import Sensors from './components/Sensors';
import classes from './style.module.css';

export default function Assistant() {
  return (
    <div className={classes.assistant}>
      <TransparentCard
        style={{ height: '100%' }}
        styles={{ body: { height: '100%', padding: 12 } }}
      >
        <BackBtn />
        <div className={classes.wrap}>
          <Chat />
          <Sensors />
        </div>
      </TransparentCard>
    </div>
  );
}
