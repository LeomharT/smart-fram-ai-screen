import BackBtn from '@/components/BackBtn';
import TransparentCard from '@/components/TransparentCard';
import classes from './style.module.css';

export default function Assistant() {
  return (
    <div className={classes.assistant}>
      <BackBtn />
      <TransparentCard style={{ height: '100%' }}></TransparentCard>
    </div>
  );
}
