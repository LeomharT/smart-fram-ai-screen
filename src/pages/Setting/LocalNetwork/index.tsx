import { getLocalNetwork, postLocalNetwork } from '@/api/setting.api';
import { MUTATIONS } from '@/constant/mutations';
import { QUERIES } from '@/constant/queries';
import type { LocalNetworkConfig } from '@/types/setting.type';
import {
  CheckOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Flex, Form, Input, Radio, Spin } from 'antd';
import { useEffect } from 'react';

export default function LocalNetwork() {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const query = useQuery({
    queryKey: [QUERIES.SETTING.LOCAL_NETWORK],
    queryFn: getLocalNetwork,
  });

  const mutation = useMutation({
    mutationKey: [MUTATIONS.SETTING.LOCAL_NETWORK.POST],
    mutationFn: postLocalNetwork,
    onSuccess() {
      message.success('提交成功');
    },
  });

  function handleOnFinish(data: LocalNetworkConfig) {
    data = {
      ...data,
      dns: (data.dns as string).split(','),
    };
    mutation.mutate(data);
  }

  useEffect(() => {
    if (query.data) {
      for (const key in query.data) {
        const _key = key as keyof LocalNetworkConfig;
        let _value = query.data[_key];
        if (_key === 'dns') _value = (_value as string[]).join(',');
        form.setFieldValue(_key, _value);
      }
    }
  }, [query.data, form]);

  return (
    <Flex justify='center'>
      <Spin spinning={query.isFetching} indicator={<LoadingOutlined />}>
        <Form
          form={form}
          style={{ minWidth: 416 }}
          labelCol={{ span: 5 }}
          labelAlign='left'
          onFinish={handleOnFinish}
        >
          <Form.Item label='IP地址'>{query.data?.ip_address}</Form.Item>
          <Form.Item name='is_dhcp'>
            <Radio.Group
              options={[
                { value: true, label: '自动获取IP' },
                { value: false, label: '设置静态IP' },
              ]}
            />
          </Form.Item>
          <Form.Item label='IP地址' name='ip_address'>
            <Input />
          </Form.Item>
          <Form.Item label='网关地址' name='gateway'>
            <Input />
          </Form.Item>
          <Form.Item label='子网掩码' name='netmask'>
            <Input />
          </Form.Item>
          <Form.Item
            label='DNS地址'
            name='dns'
            tooltip={{
              title: '请用, 分隔',
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <br />
          <Flex justify='center'>
            <Button
              type='primary'
              htmlType='submit'
              icon={<CheckOutlined />}
              loading={mutation.isPending}
            >
              确认
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Flex>
  );
}
