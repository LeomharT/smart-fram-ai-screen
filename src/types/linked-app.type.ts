export interface LinkedAppOptions {
  actuator: {
    label: string;
    value: string;
    prop: string[];
  }[];
  sensor_type: {
    label: string;
    value: string;
    prop: string[];
  }[];
  ld_operator: {
    label: string;
    value: string;
  }[];
}

export interface LinkedAppFormValue {
  id?: string;
  linkageName: string;
  isEnabled: number;
  triggerCondition: {
    device_type: string;
    property: string;
    operator: string;
    value: 35;
  }[];
  executionAction: {
    executor_type: string;
    property: string;
    value: 1;
  }[];
}
