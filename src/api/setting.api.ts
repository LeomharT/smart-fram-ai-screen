import { APIS } from '@/constant/host';
import type { SystemInformation } from '@/types/setting.type';
import fetchData from '@/utils/fetchData';

export async function getSystemInfo() {
  const res = await fetchData<SystemInformation>(APIS.SETTING.SYSTEM_INFO);
  return res?.data;
}
