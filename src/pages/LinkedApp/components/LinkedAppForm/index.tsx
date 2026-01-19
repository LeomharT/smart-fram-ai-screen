import {
  getLinkedAppOptions,
  postLinkedApp,
  putLinkedApp,
} from '@/api/linked-app';
import { MUTATIONS } from '@/constant/mutations';
import { QIERIES } from '@/constant/queries';
import type { LinkedAppFormValue } from '@/types/linked-app.type';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  type ModalProps,
} from 'antd';
import { useEffect } from 'react';
import classes from './style.module.css';

type LinkedAppFormProps = ModalProps & {
  initialValue: Partial<LinkedAppFormValue> | null;
  onSuccess?: () => void;
};

export default function LinkedAppForm(props: LinkedAppFormProps) {
  const { message } = App.useApp();

  const [form] = Form.useForm<LinkedAppFormValue>();

  const query = useQuery({
    queryKey: [QIERIES.LINKED_APP.OPTIONS],
    queryFn: getLinkedAppOptions,
    initialData: {
      actuator: [],
      ld_operator: [],
      sensor_type: [],
    },
  });

  const post = useMutation({
    mutationKey: [MUTATIONS.LINKED_APP.POST],
    mutationFn: postLinkedApp,
    onSuccess: props.onSuccess,
  });

  const put = useMutation({
    mutationKey: [MUTATIONS.LINKED_APP.PUT],
    mutationFn: putLinkedApp,
    onSuccess: props.onSuccess,
  });

  function handleOnFinish(value: LinkedAppFormValue) {
    if (props.initialValue?.id) {
      put.mutate({ id: props.initialValue.id, ...value });
    } else {
      post.mutate(value);
    }
    return;
  }

  function onDeviceChange(index: number) {
    form.setFieldValue(['triggerCondition', index, 'property'], undefined);
    form.setFieldValue(['triggerCondition', index, 'operator'], undefined);
    form.setFieldValue(['triggerCondition', index, 'value'], undefined);
  }

  function getDeviceProps(index: number) {
    const device = form.getFieldValue([
      'triggerCondition',
      index,
      'device_type',
    ]);

    const props = query.data?.sensor_type.find(
      (value) => value.value === device,
    )?.prop;

    return props?.map((item) => ({ label: item, value: item })) ?? [];
  }

  function getActuatorProps(index: number) {
    const executor = form.getFieldValue([
      'executionAction',
      index,
      'executor_type',
    ]);

    const props = query.data?.actuator.find(
      (value) => value.value === executor,
    )?.prop;

    return props?.map((item) => ({ label: item, value: item })) ?? [];
  }

  useEffect(() => {
    if (props.open && props.initialValue) {
      for (const key in props.initialValue) {
        const _key = key as keyof LinkedAppFormValue;
        form.setFieldValue(_key, props.initialValue[_key]);
      }
    }
  }, [props.initialValue, props.open, form]);

  return (
    <Modal
      {...props}
      title='联动应用'
      width='45%'
      onOk={form.submit}
      afterClose={form.resetFields}
      loading={query.isFetching}
      confirmLoading={post.isPending}
    >
      <Form
        form={form}
        onFinish={handleOnFinish}
        labelCol={{ span: 4 }}
        labelAlign='left'
      >
        <Form.Item
          name='linkageName'
          label='场景名称'
          rules={[{ required: true }]}
        >
          <Input autoComplete='off' placeholder='请输入场景名称' />
        </Form.Item>
        <Form.Item name='isEnabled' label='场景状态' initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item name='remark' label='备注信息'>
          <Input.TextArea placeholder='请输入备注信息' rows={3} />
        </Form.Item>
        <Divider />
        <Form.Item label='触发器'>
          <Form.List
            name='triggerCondition'
            rules={[
              {
                validator: async (_, names) => {
                  if (!names) {
                    return Promise.reject(new Error('请添加至少一条触发规则'));
                  }
                },
              },
            ]}
          >
            {(field, { add, remove }, { errors }) => (
              <>
                <div className={classes.section} hidden={!field.length}>
                  {field.map(({ key, name }) => (
                    <Space key={key} align='start' wrap={false}>
                      <Card styles={{ body: { paddingBottom: 36 } }}>
                        <Form.Item
                          name={[name, 'device_type']}
                          label='触发设备'
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder='请选择设备'
                            options={query.data?.sensor_type}
                            onChange={() => onDeviceChange(name)}
                          />
                        </Form.Item>
                        <div className={classes.grid}>
                          <Form.Item
                            noStyle
                            dependencies={[
                              ['triggerCondition', name, 'device_type'],
                            ]}
                          >
                            {() => {
                              return (
                                <Form.Item
                                  name={[name, 'property']}
                                  rules={[{ required: true }]}
                                  layout='vertical'
                                  label='属性'
                                >
                                  <Select
                                    placeholder='请选择设备属性'
                                    options={getDeviceProps(name)}
                                  />
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                          <Form.Item
                            name={[name, 'operator']}
                            rules={[{ required: true }]}
                            layout='vertical'
                            label='条件'
                          >
                            <Select
                              placeholder='请选择条件'
                              options={query.data?.ld_operator}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[name, 'value']}
                            rules={[{ required: true }]}
                            layout='vertical'
                            label='触发值'
                          >
                            <InputNumber
                              placeholder='请输入触发值'
                              controls={false}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </div>
                      </Card>
                      <Button
                        type='text'
                        icon={<MinusCircleOutlined />}
                        onClick={() => {
                          if (field.length === 1) {
                            message.warning('请保留至少一条触发器规则');
                          } else {
                            remove(name);
                          }
                        }}
                      />
                    </Space>
                  ))}
                </div>
                <Button
                  color='primary'
                  variant='link'
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      device_type: undefined,
                      property: undefined,
                      operator: '==',
                      value: undefined,
                    })
                  }
                >
                  添加触发器
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
        </Form.Item>
        <Divider />
        <Form.Item label='执行动作'>
          <Form.List
            name='executionAction'
            rules={[
              {
                validator: async (_, names) => {
                  if (!names) {
                    return Promise.reject(new Error('请添加至少一条执行动作'));
                  }
                },
              },
            ]}
          >
            {(field, { add, remove }, { errors }) => (
              <>
                <div className={classes.section} hidden={!field.length}>
                  {field.map(({ key, name }) => (
                    <Space key={key} align='start'>
                      <Card>
                        <Form.Item
                          label='执行器'
                          name={[name, 'executor_type']}
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder='请选择需要执行的设备'
                            options={query.data?.actuator}
                          />
                        </Form.Item>
                        <div className={classes.execution}>
                          <Form.Item
                            noStyle
                            dependencies={[
                              ['executionAction', name, 'executor_type'],
                            ]}
                          >
                            {() => {
                              return (
                                <Form.Item
                                  name={[name, 'property']}
                                  rules={[{ required: true }]}
                                  layout='vertical'
                                  label='属性'
                                >
                                  <Select
                                    placeholder='请选择设备属性'
                                    options={getActuatorProps(name)}
                                  />
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                          <Form.Item
                            name={[name, 'value']}
                            rules={[{ required: true }]}
                            layout='vertical'
                            label='动作'
                          >
                            <Select
                              placeholder='请选择动作'
                              options={[
                                { label: '开启', value: 1 },
                                { label: '关闭', value: 0 },
                              ]}
                            />
                          </Form.Item>
                        </div>
                      </Card>
                      <Button
                        type='text'
                        icon={<MinusCircleOutlined />}
                        onClick={() => {
                          if (field.length === 1) {
                            message.warning('请保留至少一条执行动作');
                          } else {
                            remove(name);
                          }
                        }}
                      />
                    </Space>
                  ))}
                </div>
                <Button
                  color='primary'
                  variant='link'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    add({
                      executor_type: undefined,
                      property: undefined,
                      value: undefined,
                    });
                  }}
                >
                  添加执行动作
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
}
