import { APIS } from '@/constant/host';
import type {
  ConnectorConfig,
  LocalNetworkConfig,
  OpenPlatformConfig,
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

export async function getConnectorConfig() {
  const res = await fetchData<ConnectorConfig>(APIS.SETTING.CONNECTOR);
  return res?.data;
}

export async function getOpenPlatform() {
  const res = await fetchData<OpenPlatformConfig>(APIS.SETTING.OPEN_PLATFORM);
  return res?.data;
}

export async function postLocalNetwork(data: LocalNetworkConfig) {
  return fetchData(APIS.SETTING.LOCAL_NETWORK, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function putConnectorConfig(data: ConnectorConfig) {
  return fetchData(APIS.SETTING.CONNECTOR, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function putOpenPlatformConfig(data: OpenPlatformConfig) {
  return fetchData(APIS.SETTING.OPEN_PLATFORM, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
