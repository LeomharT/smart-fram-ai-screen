import { APIS } from '@/constant/host';
import type { SensorData } from '@/types/assistant.type';
import fetchData from '@/utils/fetchData';

export async function getSensorData() {
  const res = await fetchData<SensorData>(APIS.ASSISTANT.SENSOR);
  return res?.data;
}
