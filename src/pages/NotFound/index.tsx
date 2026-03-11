import TransparentCard from '@/components/TransparentCard';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: 48,
        height: '100%',
      }}
    >
      <TransparentCard style={{ height: '100%' }}>
        <Result
          status='warning'
          title='404'
          subTitle='抱歉, 您所请求的界面不存在'
          extra={
            <Button
              type='primary'
              key='console'
              onClick={() => {
                navigate('/');
              }}
            >
              返回首页
            </Button>
          }
        />
      </TransparentCard>
      ;
    </div>
  );
}
