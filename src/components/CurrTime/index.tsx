import { Typography } from 'antd';
import { useEffect, useState } from 'react';
const { Text } = Typography;

const formater = new Intl.DateTimeFormat('zh-CN', {
  timeStyle: 'medium',
  dateStyle: 'medium',
});

export default function CurrTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const _timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(_timer);
  }, []);

  return (
    <div
      style={{
        alignSelf: 'start',
      }}
    >
      <Text style={{ color: '#ffffff', fontWeight: 500, fontSize: 24 }}>
        {formater.format(time)}
      </Text>
    </div>
  );
}
