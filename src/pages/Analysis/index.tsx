import TransparentCard from '@/components/TransparentCard';
import classes from './style.module.css';

export default function Analysis() {
  return (
    <div className={classes.analysis}>
      <TransparentCard style={{ height: '100%' }}></TransparentCard>
    </div>
  );
}
