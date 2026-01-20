import { CheckOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Radio } from 'antd';

export default function LocalSetting() {
  const [form] = Form.useForm();

  return (
    <Flex justify='center'>
      <Form
        form={form}
        style={{ minWidth: 416 }}
        labelCol={{ span: 4 }}
        labelAlign='left'
      >
        <Form.Item label='IP地址'></Form.Item>
        <Form.Item>
          <Radio.Group
            options={[
              { value: 1, label: '自动获取IP' },
              { value: 2, label: '设置静态IP' },
            ]}
          />
        </Form.Item>
        <Form.Item label='IP地址'>
          <Input />
        </Form.Item>
        <Form.Item label='网关地址'>
          <Input />
        </Form.Item>
        <Form.Item label='DNS地址'>
          <Input />
        </Form.Item>
        <br />
        <Flex justify='center'>
          <Button type='primary' icon={<CheckOutlined />}>
            确认
          </Button>
        </Flex>
      </Form>
    </Flex>
  );
}
