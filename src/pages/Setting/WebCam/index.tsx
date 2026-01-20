import { QUERIES } from '@/constant/queries';
import { useQuery } from '@tanstack/react-query';
import { Flex, Form } from 'antd';

export default function WebCam() {
  const [form] = Form.useForm();

  const query = useQuery({
    queryKey: [QUERIES.SETTING.WEBCAM],
  });

  return (
    <Flex justify='center'>
      <Form
        form={form}
        style={{ minWidth: 416 }}
        labelCol={{ span: 5 }}
        labelAlign='left'
      ></Form>
    </Flex>
  );
}
