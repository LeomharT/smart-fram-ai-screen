import {
  getConnectorConfig,
  getOpenPlatform,
  putConnectorConfig,
  putOpenPlatformConfig,
} from '@/api/setting.api';
import Loader from '@/components/Loader';
import { MUTATIONS } from '@/constant/mutations';
import { QUERIES } from '@/constant/queries';
import type { ConnectorConfig, OpenPlatformConfig } from '@/types/setting.type';
import { CheckOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Space,
  Typography,
} from 'antd';
import { useEffect } from 'react';

export default function NetworkConfig() {
  const [connectorForm] = Form.useForm();

  const [openForm] = Form.useForm();

  const connectorQuery = useQuery({
    queryKey: [QUERIES.SETTING.CONNECTOR],
    queryFn: getConnectorConfig,
  });

  const openQuery = useQuery({
    queryKey: [QUERIES.SETTING.OPENPLATFORM],
    queryFn: getOpenPlatform,
  });

  const connectorMutation = useMutation({
    mutationKey: [MUTATIONS.SETTING.NETWORK_CONFIG.CONNECTOR.PUT],
    mutationFn: putConnectorConfig,
    onSuccess() {
      message.success('操作成功');
    },
  });

  const openMutation = useMutation({
    mutationKey: [MUTATIONS.SETTING.NETWORK_CONFIG.OPEN_PLATFORM.PUT],
    mutationFn: putOpenPlatformConfig,
    onSuccess() {
      message.success('操作成功');
    },
  });

  useEffect(() => {
    if (connectorQuery.data) {
      for (const key in connectorQuery.data) {
        connectorForm.setFieldValue(
          key,
          connectorQuery.data[key as keyof ConnectorConfig],
        );
      }
    }
  }, [connectorQuery.data, connectorForm]);

  useEffect(() => {
    if (openQuery.data) {
      for (const key in openQuery.data) {
        openForm.setFieldValue(
          key,
          openQuery.data[key as keyof OpenPlatformConfig],
        );
      }
    }
  }, [openQuery.data, openForm]);

  return (
    <Row>
      <Col span={12}>
        <Loader spinning={connectorQuery.isFetching}>
          <Flex orientation='vertical' align='center'>
            <Typography.Title
              level={5}
              style={{ width: 416, textAlign: 'left' }}
            >
              连接器配置
            </Typography.Title>
            <br />
            <Form
              form={connectorForm}
              size='large'
              labelCol={{ span: 5 }}
              labelAlign='left'
              style={{ minWidth: 416 }}
              onFinish={connectorMutation.mutate}
            >
              <Form.Item label='IP地址' required>
                <Space.Compact style={{ width: '100%' }}>
                  <Space.Addon>mqtt://</Space.Addon>
                  <Form.Item name='ipAddr' rules={[{ required: true }]} noStyle>
                    <Input />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                label='端口'
                name='port'
                required
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label='产品KEY'
                name='userName'
                required
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='设备KEY'
                name='clientId'
                required
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='设备密钥'
                name='secretKey'
                required
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Flex justify='center'>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<CheckOutlined />}
                  loading={connectorMutation.isPending}
                >
                  确定
                </Button>
              </Flex>
            </Form>
          </Flex>
        </Loader>
      </Col>
      <Col span={12}>
        <Loader spinning={openQuery.isFetching}>
          <Flex orientation='vertical' align='center'>
            <Typography.Title
              level={5}
              style={{ width: 416, textAlign: 'left' }}
            >
              开放平台配置
            </Typography.Title>
            <br />
            <Form
              form={openForm}
              size='large'
              labelCol={{ span: 5 }}
              labelAlign='left'
              style={{ minWidth: 416 }}
              onFinish={openMutation.mutate}
            >
              <Form.Item
                label='应用ID'
                name='APP_ID'
                required
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='应用密钥'
                name='APP_SECRET'
                required
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label='基础URL'
                name='BASE_URL'
                required
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Flex justify='center'>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<CheckOutlined />}
                  loading={openMutation.isPending}
                >
                  确定
                </Button>
              </Flex>
            </Form>
          </Flex>
        </Loader>
      </Col>
    </Row>
  );
}
