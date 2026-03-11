import type {
  BubbleItemType,
  BubbleListProps,
  BubbleProps,
} from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Typography } from 'antd';

const renderMarkdown: BubbleProps['contentRender'] = (content) => {
  return (
    <Typography>
      <XMarkdown content={content} />
    </Typography>
  );
};

export const genItem = (
  isAI: boolean,
  content: string,
  config?: Partial<BubbleItemType>,
) => {
  return {
    key: config?.key ?? '',
    role: isAI ? 'ai' : 'user',
    content: content,
    styles: {
      content: {
        background: isAI ? '#ffffff' : '#00b96b',
      },
    },
    contentRender: (...args) =>
      isAI ? (
        renderMarkdown(...args)
      ) : (
        <Typography style={{ color: '#fff' }}>{content}</Typography>
      ),
    ...config,
  } as BubbleListProps['items'][number] & {
    audioChunks: string[];
  };
};
