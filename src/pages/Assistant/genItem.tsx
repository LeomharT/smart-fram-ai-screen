import type { BubbleItemType, BubbleListProps } from '@ant-design/x';

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
        color: isAI ? '#000000' : '#ffffff',
      },
    },
    ...config,
  } as BubbleListProps['items'][number] & {
    audioChunks: string[];
  };
};
