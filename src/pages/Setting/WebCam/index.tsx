import {
  getWebCamConfig,
  putWebcamConfig,
  rebootService,
} from '@/api/setting.api';
import Loader from '@/components/Loader';
import { MUTATIONS } from '@/constant/mutations';
import { QUERIES } from '@/constant/queries';
import type { WebCamConfig } from '@/types/setting.type';
import { CheckOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Flex, Form, Input } from 'antd';
import { useEffect } from 'react';

export default function WebCam() {
  const { message, modal } = App.useApp();

  const [form] = Form.useForm();

  const query = useQuery({
    queryKey: [QUERIES.SETTING.WEBCAM],
    queryFn: getWebCamConfig,
  });

  const mutation = useMutation({
    mutationKey: [MUTATIONS.SETTING.NETWORK_CONFIG.WEBCAM.PUT],
    mutationFn: putWebcamConfig,
    onSuccess() {
      modal.confirm({
        title: '提示',
        content:
          '您刚刚修改了摄像头配置, 是否要立即重启所有后台配置以使配置生效?',
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

  useEffect(() => {
    if (query.data) {
      for (const key in query.data) {
        form.setFieldValue(key, query.data[key as keyof WebCamConfig]);
      }
    }
  }, [query.data, form]);

  return (
    <Loader spinning={query.isFetching}>
      <Flex justify='center'>
        <Form
          form={form}
          size='large'
          style={{ minWidth: 512 }}
          labelCol={{ span: 7 }}
          labelAlign='left'
          onFinish={mutation.mutate}
        >
          <Form.Item
            label='网络摄像头地址'
            name='configValue'
            required
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Flex justify='center'>
            <Button
              type='primary'
              htmlType='submit'
              loading={mutation.isPending}
              icon={<CheckOutlined />}
            >
              确定
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Loader>
  );
}
