import { Modal, message } from 'antd';

type BackendResponse<T, M> = {
  data: T;
  rows: T;
  code: number;
  msg: string;
  meta: M;
  message?: string;
  total?: number;
};

export type DefaultMeta = {
  page: number;
  size: number;
  total: number;
};

export default async function fetchData<T = unknown, M = DefaultMeta>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  let token = localStorage.getItem('token');

  if (token) token = JSON.parse(token);

  const defaultHeader: {
    'CONTENT-TYPE'?: string;
  } = {
    'CONTENT-TYPE': 'application/json',
  };

  if (init?.body instanceof FormData) {
    delete defaultHeader['CONTENT-TYPE'];
  }

  try {
    const res = await fetch(input, {
      ...init,
      headers: {
        ...defaultHeader,
        ...init?.headers,
      },
    });

    const json: BackendResponse<T, M> = await res.json();

    switch (json.code) {
      case 400:
      case 402:
      case 403:
      case 404:
      case 405:
      case 422:
      case 401:
      case 500:
      case 501:
      case 502:
      case 601:
        throw new Error(json.msg);
      case 200:
      default:
        break;
    }

    return json;
  } catch (e) {
    Modal.destroyAll();
    if (e instanceof Error) {
      message.error(e.message);
    }
  }
}
