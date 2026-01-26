import { getWebCamConfig, putWebcamConfig } from '@/api/setting.api';
import Loader from '@/components/Loader';
import { MUTATIONS } from '@/constant/mutations';
import { QUERIES } from '@/constant/queries';
import type { WebCamConfig } from '@/types/setting.type';
import { CheckOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Flex, Form, Input } from 'antd';
import { useEffect } from 'react';

export default function WebCam() {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const query = useQuery({
    queryKey: [QUERIES.SETTING.WEBCAM],
    queryFn: getWebCamConfig,
  });

  const mutation = useMutation({
    mutationKey: [MUTATIONS.SETTING.NETWORK_CONFIG.WEBCAM.PUT],
    mutationFn: putWebcamConfig,
    onSuccess() {
      message.success('操作成功');
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
