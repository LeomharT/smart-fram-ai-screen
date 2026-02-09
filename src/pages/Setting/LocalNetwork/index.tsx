import {
  getLocalNetwork,
  postLocalNetwork,
  rebootService,
} from '@/api/setting.api';
import Loader from '@/components/Loader';
import { MUTATIONS } from '@/constant/mutations';
import { QUERIES } from '@/constant/queries';
import type { LocalNetworkConfig } from '@/types/setting.type';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Flex, Form, Input, Radio } from 'antd';
import { useEffect } from 'react';

export default function LocalNetwork() {
  const { message, modal } = App.useApp();

  const [form] = Form.useForm();

  const query = useQuery({
    queryKey: [QUERIES.SETTING.LOCAL_NETWORK],
    queryFn: getLocalNetwork,
  });

  const mutation = useMutation({
    mutationKey: [MUTATIONS.SETTING.LOCAL_NETWORK.POST],
    mutationFn: postLocalNetwork,
    onSuccess() {
      modal.confirm({
        title: '提示',
        content:
          '您刚刚修改了本地网络配置, 是否要立即重启所有后台配置以使配置生效?',
        okText: '重启服务',
        cancelText: '稍后重启',
        okButtonProps: { size: 'large' },
        cancelButtonProps: { size: 'large' },
        onOk: () => {
          reboot.mutate();
        },
      });
    },
  });

  const reboot = useMutation({
    mutationKey: [MUTATIONS.SETTING.REBOOT],
    mutationFn: rebootService,
    onMutate() {
      message.loading({
        key: 'LOADING',
        content: '服务重启中请稍后...',
        duration: 999999,
      });
    },
    onSuccess() {
      message.success({ key: 'LOADING', content: '服务重启成功' });
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
      <Loader spinning={query.isFetching}>
        <Form
          form={form}
          size='large'
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
      </Loader>
    </Flex>
  );
}
