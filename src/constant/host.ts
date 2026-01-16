const _MODE = import.meta.env.MODE as 'development' | 'production';

const _HOSTS = {
  development: 'http://192.168.10.109:80',
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
    POST: `${HOST}/${PREFIX}/screen/scene_linkage_config`,
  },
};
