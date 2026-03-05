import { getAlgorithm, getAnalysisResult } from '@/api/analysis.api';
import BackBtn from '@/components/BackBtn';
import Loader from '@/components/Loader';
import TransparentCard from '@/components/TransparentCard';
import { QUERIES } from '@/constant/queries';
import type { AnalysisResult } from '@/types/analysis.type';
import { Pie, type PieConfig } from '@ant-design/charts';
import { ReloadOutlined } from '@ant-design/icons';
import { useQueries } from '@tanstack/react-query';
import { Button, Flex, Image, Space, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import classes from './style.module.css';

const formater = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'medium',
  timeStyle: 'medium',
});
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

  const [selected, setSelected] = useState<AnalysisResult | null>(null);

  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const config: PieConfig = {
    forceFit: true,
    radius: 0.8,
    data: Object.keys(selected?.distribution ?? {}).map((key) => ({
      type: key,
      value: selected?.distribution[key] ?? 0,
    })),
    angleField: 'value',
    colorField: 'type',
    label: false,
    legend: {
      color: {
        position: 'right',
        layout: {
          justifyContent: 'center',
        },
      },
    },
  };

  useEffect(() => {
    if (!result.isFetching) {
      if (result.data) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory((prev) => [result.data!, ...prev]);
        setSelected(result.data);
      }
    }
  }, [result.data, result.isFetching]);

  return (
    <div className={classes.analysis}>
      <BackBtn />
      <TransparentCard
        loading={result.isPending}
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
          <Flex vertical gap={16} justify='space-between'>
            <Image
              width={480}
              height={300}
              src={`data:image/png;base64,` + (selected?.imageBase64 ?? '')}
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
          <Flex className={classes.report}>
            <Space size={'large'}>
              <AnalysisResultContent
                label='检测时间'
                content={formater.format(
                  new Date(selected?.detectionTime ?? 0),
                )}
              />
              <AnalysisResultContent
                label='检测结果'
                content={selected?.detectedLabels}
              />
            </Space>
            {Object.keys(selected?.labelsDescriptionAndMeasures ?? {}).map(
              (v, i) => (
                <Fragment key={i}>
                  <AnalysisResultContent
                    label={v}
                    content={`
                    描述: ${selected?.labelsDescriptionAndMeasures[v].description}
                     `}
                  />
                  <AnalysisResultContent
                    label={v}
                    content={`
                    措施: ${selected?.labelsDescriptionAndMeasures[v].measure}
                     `}
                  />
                </Fragment>
              ),
            )}
            <AnalysisResultContent
              label='检测结果'
              content={<Pie width={350} height={250} {...config} />}
            />
          </Flex>
        </Flex>
        <div className={classes.history}>
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
              className={classes.item}
              onClick={() => setSelected(v)}
            >
              <Image
                height={120}
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
        </div>
      </TransparentCard>
    </div>
  );
}

function AnalysisResultContent(props: {
  label: string;
  content: React.ReactNode;
}) {
  return (
    <Space align='start'>
      <img src='/assets/imgs/prefix.svg' />
      <Typography.Text
        style={{ color: '#fff', fontSize: 24, textWrap: 'nowrap' }}
      >
        {props.label}:
      </Typography.Text>
      <Typography.Text style={{ color: '#fff', fontSize: 24 }}>
        {props.content}
      </Typography.Text>
    </Space>
  );
}
