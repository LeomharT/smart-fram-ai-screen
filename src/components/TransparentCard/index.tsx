import { Card, type CardProps } from 'antd';

const stylesCard: CardProps['styles'] = {
  root: {
    background: 'rgba(255, 255, 255, 0.3)',
  },
};

export default function TransparentCard(props: CardProps) {
  return <Card {...props} styles={{ ...props.styles, ...stylesCard }}></Card>;
}
