const _MODE = import.meta.env.MODE as 'development' | 'production';

const _HOSTS = {
  development: 'http://192.168.10.108:80',
  production: 'http://192.168.10.109:9099',
};

const _PREFIXS = {
  development: 'prod-api',
  production: 'prod-api',
};

const HOST = _HOSTS[_MODE];
const PREFIX = _PREFIXS[_MODE];

export const APIS = {
  LINKED_APP: {
    LIST: `${HOST}/${PREFIX}/screen/scene_linkage_config/list`,
    OPTIONS: `${HOST}/${PREFIX}/screen/scene_linkage_config/options`,
    ENDPOINT: `${HOST}/${PREFIX}/screen/scene_linkage_config`,
  },
  SETTING: {
    LOCAL_NETWORK: `${HOST}/${PREFIX}/sys/network-config`,
    SYSTEM_INFO: `${HOST}/${PREFIX}/sys/systeminfo`,
    CONNECTOR: `${HOST}/${PREFIX}/aiot/northbound_connector/thingscloud`,
    OPEN_PLATFORM: `${HOST}/${PREFIX}/aiot/northbound_connector/nifc/openapi`,
    WEBCAM: `${HOST}/${PREFIX}/aiot/camera/system/config/rknn_ai.camera_rtsp`,
  },
  ANALYSIS: {
    RESULT: `${HOST}/${PREFIX}/sensor/detection-analysis-result`,
    ALGORIGHM: `${HOST}/${PREFIX}/algorithm/deployment/current-deployment-info`,
  },
  ASSISTANT: {
    SENSOR: `${HOST}/${PREFIX}/sensor/current-data`,
    CHAT: `${HOST}/${PREFIX}/screen/llm/chat`,
    STT: `${HOST}/${PREFIX}/screen/llm/audio2text`,
    REPORT: {
      POST: `${HOST}/${PREFIX}/screen/llm/gen_report`,
      LIST: `${HOST}/${PREFIX}/screen/report_history/list`,
    },
  },
};
