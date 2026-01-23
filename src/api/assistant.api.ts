import { APIS } from '@/constant/host';
import type { ReportContent, SensorData } from '@/types/assistant.type';
import fetchData from '@/utils/fetchData';

export async function getSensorData() {
  const res = await fetchData<SensorData>(APIS.ASSISTANT.SENSOR);
  return res?.data;
}

export async function postReport() {
  const res = await fetchData(APIS.ASSISTANT.REPORT.POST, {
    method: 'POST',
  });
  return res?.data;
}

export async function getReportList() {
  const res = await fetchData<ReportContent[]>(
    APIS.ASSISTANT.REPORT.LIST + '?pageSize=999',
  );
  return res?.rows;
}

export async function spechToText(audio: File) {
  const formData = new FormData();
  formData.set('file', audio);

  const res = await fetchData<string>(APIS.ASSISTANT.STT, {
    method: 'POST',
    body: formData,
  });

  if (res?.error) {
    throw new Error(res.error);
  }

  return res?.data;
}
