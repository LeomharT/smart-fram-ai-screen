import { postReport, spechToText } from '@/api/assistant.api';
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
import { App, Button, Card, Space, type GetRef } from 'antd';
import { Avatar } from 'antd/lib';
//@ts-ignore
import lamejs from 'lamejs';
//@ts-ignore
import BitStream from 'lamejs/src/js/BitStream';
//@ts-ignore
import Lame from 'lamejs/src/js/Lame';
//@ts-ignore
import MPEGMode from 'lamejs/src/js/MPEGMode';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import classes from './style.module.css';
import ai from '/assets/imgs/icons/ai.svg?url';

//@ts-ignore
window.MPEGMode = MPEGMode;
//@ts-ignore
window.Lame = Lame;
//@ts-ignore
window.BitStream = BitStream;

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
    key: config?.key ?? '',
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
  const { message } = App.useApp();

  const navigate = useNavigate();

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);

  const senderRef = useRef<GetRef<typeof Sender>>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [, setAudioFile] = useState<File | null>(null);

  const [items, setItems] = useState<
    (BubbleItemType & { audioChunks: string[] })[]
  >([
    genItem(
      true,
      '您好, 我是新大陆农业大模型AI助手, 可以帮您解答农业问题, 分析作物状况并生成农事报告',
      { typing: false, key: 'init' },
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
        return [
          ...prev,
          genItem(true, '', { loading: true, key: items.length }),
        ];
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

  const sttMutation = useMutation({
    mutationKey: [MUTATIONS.ASSISTANT.STT],
    mutationFn: spechToText,
    onSuccess(data?: string) {
      console.log(data);
    },
  });

  const reportMutation = useMutation({
    mutationKey: [MUTATIONS.ASSISTANT.REPORT],
    mutationFn: postReport,
    onSuccess() {
      message.success('报告生成成功');
    },
  });

  function sendMessage(message: string) {
    setItems((prev) => {
      return [
        ...prev,
        genItem(false, message, { typing: false, key: items.length }),
      ];
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

  async function handleOnRecord(recording: boolean) {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }

  async function convertWebmToMp3(webmBlob: Blob): Promise<Blob> {
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioContext = new window.AudioContext();

    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128);
    const rawData = audioBuffer.getChannelData(0);

    const samples = new Int16Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      samples[i] = rawData[i] < 0 ? rawData[i] * 0x8000 : rawData[i] * 0x7fff;
    }

    const mp3Data: Uint8Array[] = [];
    const sampleBlockSize = 1152;

    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const chunk = samples.subarray(i, i + sampleBlockSize);
      const mp3buf = encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
    }

    const endBuf = encoder.flush();
    if (endBuf.length > 0) mp3Data.push(endBuf);
    //@ts-ignore
    return new Blob(mp3Data, { type: 'audio/mp3' });
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        try {
          const mp3Blob = await convertWebmToMp3(webmBlob);
          const file = new File([mp3Blob], `audio_${Date.now()}.mp3`, {
            type: 'audio/mp3',
          });

          setAudioFile(file);
          sttMutation.mutate(file);
          console.log('录音封装完成:', file);
        } catch (error) {
          message.error({ content: '音频格式转换失败', key: 'mp3-processing' });
          console.error(error);
        }
      };
      mediaRecorder.start();
    } catch {
      message.error('无法访问麦克风');
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
  };

  return (
    <Card className={classes.chat} styles={{ body: { height: '100%' } }}>
      <Space className={classes.btns} vertical>
        <Button
          type='primary'
          shape='round'
          onClick={() => reportMutation.mutate()}
          loading={reportMutation.isPending}
        >
          一键生成农事报告
        </Button>
        <Button
          variant='link'
          color='primary'
          block
          shape='round'
          onClick={() => {
            navigate('report');
          }}
        >
          查看农事报告
        </Button>
      </Space>
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
          allowSpeech={{ onRecordingChange: handleOnRecord }}
          autoSize={{ minRows: 3, maxRows: 3 }}
          loading={mutation.isPending}
          onSubmit={sendMessage}
        />
      </Card>
    </Card>
  );
}
