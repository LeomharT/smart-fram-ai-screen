import { APIS } from '@/constant/host';
import type {
  LinkedAppFormValue,
  LinkedAppOptions,
  LinkedApps,
} from '@/types/linked-app.type';
import fetchData from '@/utils/fetchData';

export async function getLinkedAppList() {
  return fetchData<LinkedApps[]>(APIS.LINKED_APP.LIST);
}

export async function getLinkedAppOptions() {
  return fetchData<LinkedAppOptions>(APIS.LINKED_APP.OPTIONS);
}

export async function postLinkedApp(value: LinkedAppFormValue) {
  return fetchData(APIS.LINKED_APP.POST, {
    method: 'POST',
    body: JSON.stringify({
      ...value,
      triggerCondition: JSON.stringify(value.triggerCondition),
      executionAction: JSON.stringify(value.executionAction),
    }),
  });
}
