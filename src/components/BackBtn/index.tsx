import { useNavigate } from 'react-router';
import classes from './style.module.css';
export default function BackBtn() {
  const navigate = useNavigate();

  return (
    <div className={classes.btn} onClick={() => navigate('/')}>
      <BackSVG />
    </div>
  );
}

function BackSVG() {
  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M15.4196 6.64225V1.50424C15.4196 0.16793 13.4503 -0.503798 12.3027 0.443053L0.53471 10.1117C-0.178237 10.6976 -0.178237 11.6481 0.53471 12.234L12.2983 21.9026C13.4503 22.8495 15.4153 22.1778 15.4153 20.8414V15.3033C19.593 15.2925 27.218 14.9209 27.218 23.439C27.218 27.6588 23.1838 31.1854 17.828 32C26.4399 31.1282 32 23.5677 32 19.0692C32.0043 8.61456 18.5497 6.69584 15.4196 6.64225Z'
        fill='white'
      />
    </svg>
  );
}
