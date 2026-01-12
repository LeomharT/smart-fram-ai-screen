import { Button } from 'antd';
import { useNavigate } from 'react-router';
import classes from './style.module.css';
import navi_1 from '/assets/imgs/navi_1.png?url';
import navi_2 from '/assets/imgs/navi_2.png?url';
import navi_3 from '/assets/imgs/navi_3.png?url';
import navi_4 from '/assets/imgs/navi_4.png?url';

export default function Home() {
  const navigate = useNavigate();

  const items = [
    {
      url: '/analysis',
      src: navi_1,
      label: 'AI智能识别',
    },
    {
      url: '/assistant',
      src: navi_2,
      label: '农场模型助手',
    },
    {
      url: '/linkedApp',
      src: navi_3,
      label: '联动应用',
    },
    {
      url: '/setting',
      src: navi_4,
      label: '服务配置',
    },
  ];

  return (
    <div className={classes.home}>
      <div className={classes.footer}></div>
      <div className={classes.list}>
        {items.map((value, index) => (
          <div
            key={index}
            className={classes.item}
            style={{ backgroundImage: `url(${value.src})` }}
          >
            <Button ghost onClick={() => navigate(value.url)}>
              {value.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
