import { getAlgorithm, getAnalysisResult } from '@/api/analysis.api';
import BackBtn from '@/components/BackBtn';
import Loader from '@/components/Loader';
import TransparentCard from '@/components/TransparentCard';
import { QUERIES } from '@/constant/queries';
import type { AnalysisResult } from '@/types/analysis.type';
import { Pie, type PieConfig } from '@ant-design/charts';
import { ReloadOutlined } from '@ant-design/icons';
import { useQueries } from '@tanstack/react-query';
import { Button, Card, Flex, Image, Space, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import classes from './style.module.css';

export default function Analysis() {
  const [result, algorithm] = useQueries({
    queries: [
      {
        queryKey: [QUERIES.ANALYSIS.RESULT],
        queryFn: getAnalysisResult,
      },
      {
        queryKey: [QUERIES.ANALYSIS.ALGORIGHM],
        queryFn: getAlgorithm,
      },
    ],
  });

  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const config: PieConfig = {
    forceFit: true,
    radius: 0.8,
    data: Object.keys(result.data?.distribution ?? {}).map((key) => ({
      type: key,
      value: result.data?.distribution[key] ?? 0,
    })),
    angleField: 'value',
    colorField: 'type',
    label: false,
  };

  useEffect(() => {
    if (!result.isFetching) {
      if (result.data) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory((prev) => [result.data!, ...prev]);
      }
    }
  }, [result.data, result.isFetching]);

  return (
    <div className={classes.analysis}>
      <BackBtn />
      <TransparentCard
        // loading={result.isFetching && !result.data}
        style={{ height: '100%' }}
        styles={{ body: { height: '100%' } }}
      >
        <Flex className={classes.algorithm}>
          <Loader spinning={algorithm.isFetching}>
            <Space>
              <Typography.Text>算法服务:</Typography.Text>
              <Space>
                <Typography.Text strong>
                  {algorithm.data?.current_deployment.model_name}
                </Typography.Text>
              </Space>
              <Button
                type='text'
                size='large'
                icon={<ReloadOutlined />}
                onClick={() => algorithm.refetch()}
              />
            </Space>
          </Loader>
        </Flex>
        <Flex className={classes.title}>
          <Typography.Title level={2}>
            {algorithm.data?.current_deployment.model_name}
          </Typography.Title>
        </Flex>
        <Flex className={classes.content}>
          <Flex vertical gap={16}>
            <Image
              width={480}
              height={300}
              src={`data:image/png;base64,` + (result.data?.imageBase64 ?? '')}
            />
            <Button
              size='large'
              type='primary'
              loading={result.isFetching}
              onClick={() => result.refetch()}
            >
              拍照识别
            </Button>
          </Flex>
          <Flex
            wrap
            gap={24}
            align='start'
            justify='flex-start'
            style={{ height: 'fit-content' }}
          >
            <AnalysisResultContent
              label='检测时间'
              content={result.data?.detectionTime}
            />
            <AnalysisResultContent
              label='检测结果'
              content={result.data?.detectedLabels}
            />
            {Object.keys(result.data?.labelsDescriptionAndMeasures ?? {}).map(
              (v, i) => (
                <Fragment key={i}>
                  <AnalysisResultContent
                    label={v}
                    content={`
                    描述: ${result.data?.labelsDescriptionAndMeasures[v].description}
                     `}
                  />
                  <AnalysisResultContent
                    label={v}
                    content={`
                    措施: ${result.data?.labelsDescriptionAndMeasures[v].measure}
                     `}
                  />
                </Fragment>
              ),
            )}
            <AnalysisResultContent
              label='检测结果'
              content={<Pie width={250} height={250} {...config} />}
            />
          </Flex>
        </Flex>
        <Card className={classes.history} styles={{ body: { padding: 12 } }}>
          <Flex gap={12}>
            <Typography.Title
              level={2}
              style={{
                writingMode: 'vertical-lr',
                color: 'white',
                fontWeight: '300',
              }}
            >
              识别历史
            </Typography.Title>
            {history.map((v, i) => (
              <Flex
                key={i}
                vertical
                justify='space-between'
                style={{ minWidth: 'max-content', background: '#005C25' }}
              >
                <Image
                  height={80}
                  preview={false}
                  src={`data:image/png;base64,` + (v?.imageBase64 ?? '')}
                />
                <Space vertical style={{ padding: 2 }} size={0}>
                  <Typography.Text style={{ color: '#fff' }}>
                    {v.detectedLabels}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#fff' }}>
                    {v.detectionTime}
                  </Typography.Text>
                </Space>
              </Flex>
            ))}
          </Flex>
        </Card>
      </TransparentCard>
    </div>
  );
}

function AnalysisResultContent(props: {
  label: string;
  content: React.ReactNode;
}) {
  return (
    <Space>
      <img src='/assets/imgs/prefix.svg' />
      <Typography.Text style={{ color: '#fff', fontSize: 24 }}>
        {props.label}:
      </Typography.Text>
      <Typography.Text style={{ color: '#fff', fontSize: 24 }}>
        {props.content}
      </Typography.Text>
    </Space>
  );
}
