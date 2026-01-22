export interface SensorValue {
  value: number;
  unit: string;
}

export interface SensorData {
  CO2: SensorValue;
  'PM2.5': SensorValue;
  TVOC: SensorValue;
  光照强度: SensorValue;
  大气压强: SensorValue;
  温度: SensorValue;
  湿度: SensorValue;
}

export interface ChatData {
  query: string;
  conversation_id: string;
}

export interface ChatResponse {
  answer: string;
  conversation_id: string;
  created_at: number;
  event: 'message' | 'tts_message_end' | 'tts_message';
  from_variable_selector?: string[];
  id: string;
  message_id: string;
  task_id: string;
  audio: string;
}

export interface ReportContent {
  content: string;
  createdAt: string;
  generationProgress: string;
  id: number;
  modelName: string;
  modelType: string;
}
