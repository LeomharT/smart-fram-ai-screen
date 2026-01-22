import { getReportList } from '@/api/assistant.api';
import BackBtn from '@/components/BackBtn';
import TransparentCard from '@/components/TransparentCard';
import { QUERIES } from '@/constant/queries';
import type { ReportContent } from '@/types/assistant.type';
import { useQuery } from '@tanstack/react-query';
import { Card, Divider, Flex, Space, Typography } from 'antd';
import { useState } from 'react';
import classes from './style.module.css';

const formater = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'medium',
});

export default function Report() {
  const list = useQuery({
    queryKey: [QUERIES.ASSISTANT.REPORT.LIST],
    queryFn: getReportList,
    initialData: [],
  });

  const [selected, setSelected] = useState<ReportContent | null>(null);

  return (
    <div className={classes.report}>
      <BackBtn />
      <TransparentCard
        style={{ height: '100%' }}
        styles={{ body: { height: '100%' } }}
      >
        <Flex gap={24} style={{ height: '100%' }}>
          <div className={classes.content}>
            <Card style={{ height: '100%', overflow: 'auto' }}>
              <Flex align='center' vertical>
                <Typography.Title>农事报告</Typography.Title>
                <Space align='center'>
                  <Typography.Title level={2} style={{ margin: 0 }}>
                    时间: {formater.format(new Date(selected?.createdAt ?? 0))}
                  </Typography.Title>
                  <Divider vertical />
                  <Typography.Title level={2} style={{ margin: 0 }}>
                    作物: {selected?.modelName}
                  </Typography.Title>
                </Space>
                <pre style={{ fontSize: 18 }}>{selected?.content}</pre>
              </Flex>
            </Card>
          </div>
          <div className={classes.history}>
            <Card className={classes.list}>
              <Typography.Title level={4} style={{ color: 'white' }}>
                历史报告
              </Typography.Title>
              <Flex vertical gap={12}>
                {list.data?.map((item) => (
                  <Card
                    key={item.id}
                    className={classes.item}
                    styles={{
                      body: {
                        background:
                          selected?.id === item.id ? '#f6ffed' : 'white',
                      },
                    }}
                    onClick={() => {
                      setSelected(item);
                    }}
                  >
                    <Space>
                      <img src='/assets/imgs/title.svg' />
                      <Typography.Title level={3} style={{ margin: 0 }}>
                        {formater.format(new Date(item.createdAt))}
                      </Typography.Title>
                    </Space>
                    <br />
                    <span className={classes.preview}>
                      {item.content.slice(0, 50)}
                    </span>
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
