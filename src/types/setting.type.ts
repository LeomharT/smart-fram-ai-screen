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
