import { APIS } from '@/constant/host';
import type {
  LinkedAppFormValue,
  LinkedAppOptions,
  LinkedApps,
} from '@/types/linked-app.type';
import fetchData from '@/utils/fetchData';

export async function getLinkedAppList(search: string) {
  const res = await fetchData<LinkedApps[]>(APIS.LINKED_APP.LIST + search);
  return {
    data: res?.rows,
    total: res?.total,
  };
}

export async function getLinkedAppOptions() {
  const res = await fetchData<LinkedAppOptions>(APIS.LINKED_APP.OPTIONS);
  return res?.data;
}

export async function postLinkedApp(value: LinkedAppFormValue) {
  return fetchData(APIS.LINKED_APP.ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      ...value,
      triggerCondition: JSON.stringify(value.triggerCondition),
      executionAction: JSON.stringify(value.executionAction),
    }),
  });
}

export async function putLinkedApp(value: LinkedAppFormValue) {
  return fetchData(APIS.LINKED_APP.ENDPOINT, {
    method: 'PUT',
    body: JSON.stringify({
      ...value,
      triggerCondition: JSON.stringify(value.triggerCondition),
      executionAction: JSON.stringify(value.executionAction),
    }),
  });
}

export async function deleteLinkedApp(id: string) {
  return fetchData(APIS.LINKED_APP.ENDPOINT + `/${id}`, {
    method: 'DELETE',
  });
}
