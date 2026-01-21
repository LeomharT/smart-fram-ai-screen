import { RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import classes from './style.module.css';
export default function BackBtn() {
  const navigate = useNavigate();

  return (
    <div className={classes.btn} onClick={() => navigate('/')}>
      <RollbackOutlined />
    </div>
  );
}
