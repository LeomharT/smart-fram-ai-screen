import { LoadingOutlined } from '@ant-design/icons';
import { Spin, type SpinProps } from 'antd';

type LoaderProps = SpinProps;

export default function Loader(props: LoaderProps) {
  return <Spin {...props} indicator={<LoadingOutlined />}></Spin>;
}
