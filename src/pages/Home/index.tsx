import { Dropdown } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import classes from './style.module.css';
import navi_1 from '/assets/imgs/navi_1.png?url';
import navi_2 from '/assets/imgs/navi_2.png?url';
import navi_3 from '/assets/imgs/navi_3.png?url';
import navi_4 from '/assets/imgs/navi_4.png?url';

export default function Home() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState('');

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
            onClick={() => navigate(value.url)}
          >
            <button>{value.label}</button>
          </div>
        ))}
        <div
          className={classes.item}
          style={{ backgroundImage: `url(${navi_4})` }}
        >
          <Dropdown
            styles={{
              itemContent: {
                fontSize: 20,
              },
            }}
            menu={{
              items: [
                { label: '草莓', key: '草莓' },
                { label: '苹果', key: '苹果' },
                { label: '桔子', key: '桔子' },
                { label: '橙子', key: '橙子' },
                { label: '梨', key: '梨' },
              ],
              onClick: (e) => {
                setSelected(e.key);
              },
            }}
          >
            <button>{selected ? selected + '生长状态检测' : '算法选择'}</button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
