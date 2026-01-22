import { APIS } from '@/constant/host';
import { MUTATIONS } from '@/constant/mutations';
import type { ChatData, ChatResponse } from '@/types/assistant.type';
import {
  Bubble,
  Sender,
  type BubbleItemType,
  type BubbleListProps,
} from '@ant-design/x';
import { useMutation } from '@tanstack/react-query';
import { Card, type GetRef } from 'antd';
import { Avatar } from 'antd/lib';
import { useMemo, useRef, useState } from 'react';
import classes from './style.module.css';
import ai from '/assets/imgs/icons/ai.svg?url';

// const actionItems = [
//   {
//     key: 'sound',
//     icon: <SoundOutlined style={{ fontSize: 16, color: '#fff' }} />,
//     label: '语音播放',
//   },
// ];

const genItem = (
  isAI: boolean,
  content: string,
  config?: Partial<BubbleItemType>,
) => {
  return {
    key: config?.key ?? crypto.randomUUID(),
    role: isAI ? 'ai' : 'user',
    content: content,
    styles: {
      content: {
        background: isAI ? '#ffffff' : '#00b96b',
        color: isAI ? '#000' : '#fff',
      },
    },
    ...config,
  } as BubbleListProps['items'][number] & {
    audioChunks: string[];
  };
};

export default function Chat() {
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);

  const senderRef = useRef<GetRef<typeof Sender>>(null);

  const [items, setItems] = useState<
    (BubbleItemType & { audioChunks: string[] })[]
  >([
    genItem(
      true,
      '您好, 我是新大陆农业大模型AI助手, 可以帮您解答农业问题, 分析作物状况并生成农事报告',
      { typing: false },
    ),
  ]);

  const memoRole: BubbleListProps['role'] = useMemo(
    () => ({
      ai: {
        typing: true,
        avatar: () => <Avatar src={ai} />,
        footer: () => null,
      },
      user: {
        placement: 'end',
        typing: true,
      },
    }),
    [],
  );

  const mutation = useMutation({
    mutationKey: [MUTATIONS.ASSISTANT.CHAT],
    mutationFn: async (data: Partial<ChatData>) => {
      setItems((prev) => {
        return [...prev, genItem(true, '', { loading: true })];
      });

      return new Promise((resolve, reject) => {
        const search = new URLSearchParams(
          data as unknown as Record<string, string>,
        );
        const source = new EventSource(
          APIS.ASSISTANT.CHAT + `?${search.toString()}`,
        );

        source.onmessage = (ev) => {
          const data: ChatResponse = JSON.parse(ev.data);

          if (data.event === 'message') updateLastAIChatContent(data.answer);
          if (data.event === 'tts_message') updateLastAIChatAudio(data.audio);

          if (data.event === 'tts_message_end') {
            source.close();
            resolve('success');
          }
        };

        source.onerror = (ev) => {
          reject(ev);
        };
      });
    },
  });

  function sendMessage(message: string) {
    setItems((prev) => {
      return [...prev, genItem(false, message, { typing: false })];
    });

    senderRef.current?.clear();
    listRef.current?.scrollTo({ top: 'bottom', behavior: 'instant' });

    mutation.mutate({ query: message });
  }

  const updateLastAIChatContent = (content: string) => {
    setItems((prev) => {
      const lastItem = prev[prev.length - 1];
      if (lastItem && lastItem.role === 'ai') {
        const newItems = [...prev];
        newItems[newItems.length - 1] = {
          ...lastItem,
          loading: false,
          content: lastItem.content + content,
        };
        return newItems;
      }
      return prev;
    });
  };

  const updateLastAIChatAudio = (audioChunk: string) => {
    setItems((prev) => {
      const lastItem = prev[prev.length - 1];
      if (lastItem && lastItem.role === 'ai') {
        const newItems = [...prev];
        const audioChunks = lastItem.audioChunks || [];
        newItems[newItems.length - 1] = {
          ...lastItem,
          audioChunks: [...audioChunks, audioChunk],
        };
        return newItems;
      }
      return prev;
    });
  };

  return (
    <Card className={classes.chat} styles={{ body: { height: '100%' } }}>
      <Bubble.List
        ref={listRef}
        items={items}
        role={memoRole}
        autoScroll
        style={{
          height: 'calc(100% - 101px)',
          maxWidth: 760,
          margin: '0 auto',
        }}
      />
      <Card
        style={{ maxWidth: 760, margin: '0 auto' }}
        styles={{ body: { padding: 0 } }}
      >
        <Sender
          ref={senderRef}
          allowSpeech={{ onRecordingChange: console.log }}
          autoSize={{ minRows: 3, maxRows: 3 }}
          loading={mutation.isPending}
          onSubmit={sendMessage}
        />
      </Card>
    </Card>
  );
}
