export interface LocalNetworkConfig {
  dns: string[] | string;
  gateway: string;
  interface: string;
  ip_address: string;
  is_dhcp: true;
  netmask: string;
}

export interface SystemInformation {
  application_version: string;
  gpu_model: string;
  memory: string;
  npu_performance: string;
  processor: string;
  sn_code: string;
  storage: string;
  system_version: string;
}

export interface ConnectorConfig {
  clientId: string;
  ipAddr: string;
  port: number;
  secretKey: string;
  userName: string;
}

export interface OpenPlatformConfig {
  APP_ID: string;
  APP_SECRET: string;
  BASE_URL: string;
}
