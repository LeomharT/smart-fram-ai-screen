import { getReportList } from '@/api/assistant.api';
import BackBtn from '@/components/BackBtn';
import TransparentCard from '@/components/TransparentCard';
import { QUERIES } from '@/constant/queries';
import type { ReportContent } from '@/types/assistant.type';
import { useQuery } from '@tanstack/react-query';
import { Card, Divider, Empty, Flex, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import classes from './style.module.css';
const { Title, Text } = Typography;

const formater = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'medium',
});

export default function Report() {
  const query = useQuery({
    queryKey: [QUERIES.ASSISTANT.REPORT.LIST],
    queryFn: getReportList,
    initialData: [],
  });

  const [selected, setSelected] = useState<ReportContent | null>(null);

  useEffect(() => {
    if (query.data?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(query.data[0]);
    }
  }, [query.data]);

  return (
    <div className={classes.report}>
      <BackBtn />
      <TransparentCard
        style={{ height: '100%' }}
        styles={{ body: { height: '100%' } }}
      >
        <Flex gap={24} style={{ height: '100%' }}>
          <Card className={classes.content} loading={query.isFetching}>
            {!selected ? (
              <Empty></Empty>
            ) : (
              <Flex vertical className={classes.text}>
                <Typography.Title>农事报告</Typography.Title>
                <Flex justify='center'>
                  <Typography.Title level={2} style={{ margin: 0 }}>
                    时间:
                    {formater.format(new Date(selected?.createdAt ?? 0))}
                  </Typography.Title>
                  <Divider vertical />
                  <Typography.Title level={2} style={{ margin: 0 }}>
                    作物:{selected?.modelName}
                  </Typography.Title>
                </Flex>
                <div className={classes.markdown}>
                  <Markdown>{selected?.content}</Markdown>
                </div>
              </Flex>
            )}
          </Card>
          <div className={classes.history}>
            <Card
              title='历史报告'
              className={classes.list}
              loading={query.isFetching}
            >
              <Flex vertical gap={12}>
                {query.data?.map((item) => (
                  <Card
                    key={item.id}
                    className={classes.item}
                    data-selected={selected?.id === item.id}
                    onClick={() => setSelected(item)}
                  >
                    <Space>
                      <img src='/assets/imgs/title.svg' />
                      <Title level={3} style={{ margin: 0 }}>
                        {formater.format(new Date(item.createdAt))}
                      </Title>
                    </Space>
                    <div>
                      <Text>{item.content.slice(0, 50)}</Text>
                    </div>
                  </Card>
                ))}
              </Flex>
            </Card>
          </div>
        </Flex>
      </TransparentCard>
    </div>
  );
}
