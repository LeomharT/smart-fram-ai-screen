import { getTips, postReport, putTip, spechToText } from '@/api/assistant.api';
import { APIS } from '@/constant/host';
import { MUTATIONS } from '@/constant/mutations';
import type { ChatData, ChatResponse } from '@/types/assistant.type';
import {
  Bubble,
  Sender,
  type BubbleItemType,
  type BubbleListProps,
  type BubbleProps,
} from '@ant-design/x';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  type GetRef,
} from 'antd';
import { Avatar } from 'antd/lib';
//@ts-ignore
import lamejs from 'lamejs';
//@ts-ignore
import BitStream from 'lamejs/src/js/BitStream';
//@ts-ignore
import Lame from 'lamejs/src/js/Lame';
//@ts-ignore
import { QUERIES } from '@/constant/queries';
import {
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import XMarkdown from '@ant-design/x-markdown';
//@ts-ignore
import MPEGMode from 'lamejs/src/js/MPEGMode';
import { useEffect, useRef, useState } from 'react';
import classes from './style.module.css';
import ai from '/assets/imgs/icons/ai.svg?url';

//@ts-ignore
window.MPEGMode = MPEGMode;
//@ts-ignore
window.Lame = Lame;
//@ts-ignore
window.BitStream = BitStream;

const renderMarkdown: BubbleProps['contentRender'] = (content) => {
  return (
    <Typography>
      <XMarkdown content={content} />
    </Typography>
  );
};

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

export default function Chat() {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  const listRef = useRef<GetRef<typeof Bubble.List>>(null);

  const senderRef = useRef<GetRef<typeof Sender>>(null);

  const [recording, setRecording] = useState(false);

  const eventSourceRef = useRef<EventSource>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [, setAudioFile] = useState<File | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const urlRef = useRef<string>('');

  const aiAudioChunk = useRef<Record<string, string[]>>({});
  const ttsChunkRef = useRef<string[]>([]);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const queueRef = useRef<Uint8Array[]>([]);

  const [items, setItems] = useState<BubbleItemType[]>([
    genItem(
      true,
      '您好, 我是新大陆农业大模型AI助手, 可以帮您解答农业问题, 分析作物状况并生成农事报告',
      { typing: false, key: 'init' },
    ),
  ]);

  const memoRole: BubbleListProps['role'] = {
    ai: {
      typing: true,
      avatar: () => <Avatar src={ai} />,
      footer: (_, { key }) => {
        if (key === 'init') return;
        return (
          <Button
            type='text'
            size='large'
            className={classes.action}
            icon={<SoundOutlined />}
            onClick={async () => {
              if (!key) return;

              const chunk = aiAudioChunk.current[key];
              if (!chunk) return;

              const byteArrays = chunk.map(
                (base64) => new Uint8Array(base64ToArrayBuffer(base64)),
              );

              const combinedBlob = new Blob(byteArrays, {
                type: 'audio/mp3',
              });

              const url = URL.createObjectURL(combinedBlob);
              const audio = new Audio(url);
              audio.play();

              audio.onended = () => URL.revokeObjectURL(url);
            }}
          />
        );
      },
    },
    user: {
      placement: 'end',
      typing: true,
    },
  };

  const query = useQuery({
    queryKey: [QUERIES.ASSISTANT.TIPS],
    queryFn: getTips,
  });

  const mutation = useMutation({
    mutationKey: [MUTATIONS.ASSISTANT.CHAT],
    mutationFn: async (data: Partial<ChatData>) => {
      setItems((prev) => {
        return [
          ...prev,
          genItem(true, '', { loading: true, key: items.length }),
        ];
      });

      audioRef.current?.pause();
      ttsChunkRef.current = [];
      eventSourceRef.current?.close();

      return new Promise((resolve, reject) => {
        const search = new URLSearchParams(
          data as unknown as Record<string, string>,
        );
        const source = new EventSource(
          APIS.ASSISTANT.CHAT + `?${search.toString()}`,
        );
        eventSourceRef.current = source;

        source.onmessage = (ev) => {
          const data: ChatResponse = JSON.parse(ev.data);

          if (data.event === 'message') {
            updateLastAIChatContent(data.answer);
          }
          if (data.event === 'tts_message') {
            updateLastAIChatAudioChunk(data.audio);

            const buffer = new Uint8Array(base64ToArrayBuffer(data.audio));
            queueRef.current.push(buffer);

            if (queueRef.current.length === 5 && !mediaSourceRef.current) {
              playAudio();
            } else {
              processQueue();
            }
          }
          if (data.event === 'tts_message_end') {
            if (mediaSourceRef.current?.readyState === 'open') {
              mediaSourceRef.current.endOfStream();
            }
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
      if (data) senderRef.current?.insert(data);
    },
    onError(err) {
      console.log(err);
      setRecording(false);
    },
  });

  const reportMutation = useMutation({
    mutationKey: [MUTATIONS.ASSISTANT.REPORT],
    mutationFn: postReport,
    onSuccess() {
      message.success('报告生成成功');
    },
  });

  const tipMutation = useMutation({
    mutationKey: [MUTATIONS.ASSISTANT.TIP],
    mutationFn: putTip,
    onSuccess() {
      message.success('提示词添加成功');
      query.refetch();
      setOpen(false);
    },
  });

  function sendMessage(message: string) {
    setItems((prev) => {
      return [
        ...prev,
        genItem(false, message, { typing: false, key: items.length }),
      ];
    });

    resetAudioEngine();

    senderRef.current?.clear();
    listRef.current?.scrollTo({ top: 'bottom', behavior: 'instant' });

    audioRef.current?.pause();
    audioRef.current = null;

    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.play().catch(() => {});

    mutation.mutate({ query: message });
  }

  function updateLastAIChatContent(content: string) {
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
  }

  function updateLastAIChatAudioChunk(content: string) {
    const lastItem = items[items.length - 1];

    if (lastItem && lastItem.role === 'ai') {
      if (!aiAudioChunk.current[lastItem.key]) {
        aiAudioChunk.current[lastItem.key] = [];
      }

      aiAudioChunk.current[lastItem.key] = [
        ...aiAudioChunk.current[lastItem.key],
        content,
      ];
    }
  }

  async function handleOnRecord(recording: boolean) {
    setRecording(recording);
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

  const cancelMutation = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;

    setItems((prev) => {
      if (prev.length === 0) return prev;
      const lastItem = prev[prev.length - 1];
      if (lastItem.role === 'ai' && lastItem.loading) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    mutation.reset();
  };

  function playAudio() {
    resetAudioEngine();

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const ms = new MediaSource();
    mediaSourceRef.current = ms;
    const url = URL.createObjectURL(ms);
    urlRef.current = url;
    audioRef.current.src = url;

    ms.addEventListener('sourceopen', () => {
      if (ms.sourceBuffers.length > 0) return;

      const sb = ms.addSourceBuffer('audio/mpeg');
      sourceBufferRef.current = sb;

      // 当这一片数据处理完，尝试追加下一片
      sb.addEventListener('updateend', () => {
        processQueue();
      });

      audioRef.current?.play().catch((e) => console.error('播放失败 ', e));

      // 初始启动：如果已经有数据在队列里了
      processQueue();
    });
  }

  function processQueue() {
    const sb = sourceBufferRef.current;
    if (!sb || sb.updating || queueRef.current.length === 0) return;

    const nextChunk = queueRef.current.shift();
    if (nextChunk) {
      try {
        sb.appendBuffer(nextChunk as any);
      } catch (e) {
        console.error('AppendBuffer Failed', e);
      }
    }
  }

  const resetAudioEngine = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.src = '';
      audioRef.current.load();
    }

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = '';
    }

    mediaSourceRef.current = null;
    sourceBufferRef.current = null;

    queueRef.current = [];
    ttsChunkRef.current = [];
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className={classes.chat}>
      <Modal
        title='添加提示词'
        open={open}
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        confirmLoading={mutation.isPending}
        onOk={() => form.submit()}
      >
        <Form form={form} size='large' onFinish={tipMutation.mutate}>
          <Form.Item
            required
            name='tips'
            label='提示词'
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder='请输入提示词' />
          </Form.Item>
        </Form>
      </Modal>
      <Space className={classes.btns} vertical>
        <Button
          size='large'
          shape='round'
          type='primary'
          loading={reportMutation.isPending}
          onClick={() => reportMutation.mutate()}
          icon={<InboxOutlined />}
        >
          一键生成农事报告
        </Button>
        <Button
          block
          size='large'
          variant='filled'
          color='primary'
          shape='round'
          icon={<EyeOutlined />}
        >
          查看农事报告
        </Button>
      </Space>
      <Bubble.List
        className={classes.bubbles}
        ref={listRef}
        items={items}
        role={memoRole}
        autoScroll
      />
      <div className={classes.sender}>
        <Flex wrap gap={12} style={{ marginBottom: 12 }}>
          {query.data?.split(';').map((value, index) => (
            <Button
              key={index}
              onClick={() => {
                senderRef.current?.clear();
                setTimeout(() => {
                  senderRef.current?.insert(value);
                });
              }}
            >
              {value}
            </Button>
          ))}
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
              form.setFieldValue('tips', query.data);
            }}
          >
            添加常用语
          </Button>
        </Flex>
        <Sender
          ref={senderRef}
          classNames={{
            suffix: classes.suffix,
            input: classes.input,
          }}
          allowSpeech={{
            onRecordingChange: handleOnRecord,
            recording: recording || sttMutation.isPending,
          }}
          autoSize={{ minRows: 3, maxRows: 3 }}
          loading={mutation.isPending}
          onSubmit={sendMessage}
          onCancel={() => {
            cancelMutation();
            resetAudioEngine();
          }}
        />
      </div>
    </div>
  );
}

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
