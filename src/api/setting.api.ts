import { APIS } from '@/constant/host';
import type {
  LocalNetworkConfig,
  SystemInformation,
} from '@/types/setting.type';
import fetchData from '@/utils/fetchData';

export async function getLocalNetwork() {
  const res = await fetchData<LocalNetworkConfig>(APIS.SETTING.LOCAL_NETWORK);
  return res?.data;
}

export async function getSystemInfo() {
  const res = await fetchData<SystemInformation>(APIS.SETTING.SYSTEM_INFO);
  return res?.data;
}

export async function postLocalNetwork(data: LocalNetworkConfig) {
  return fetchData(APIS.SETTING.LOCAL_NETWORK, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
