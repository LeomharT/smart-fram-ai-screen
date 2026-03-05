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

export interface TirggerCondition {
  device_type: string;
  property: string;
  operator: string;
  value: string;
}

export interface ExecutionAction {
  executor_type: string;
  property: string;
  value: number;
}

export interface LinkedAppFormValue {
  id?: string;
  linkageName: string;
  isEnabled: number;
  triggerCondition: TirggerCondition[];
  executionAction: ExecutionAction[];
  remark: string;
}

export interface LinkedApps {
  id: number;
  executionAction: ExecutionAction[];
  isEnabled: number;
  linkageName: number;
  triggerCondition: TirggerCondition[];
  createdAt: string;
}
