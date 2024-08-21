export interface ConditionT {
  _id: string;
  field: string;
  operator: string;
  value: any;
}

export interface ActionT {
  _id: string;
  type: string;
  algorithm?: string;
  key_size?: number;
}

export interface RoleT {
  _id: string;
  id: string;
  name: string;
  description: string;
  conditions: ConditionT[];
  actions: ActionT[];
  priority: number;
  enabled: boolean;
}

export interface RolesStateT {
  roles: RoleT[];
}
