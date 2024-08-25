export interface Condition {
  field: string;
  operator:
    | "equals"
    | "greater_than"
    | "less_than"
    | "not_equals"
    | "greater_or_equal"
    | "less_or_equal";
  value: string | number | boolean;
}

export interface Action {
  type: string;
  algorithm?: string;
  key_size?: number;
}

export interface Rule extends Document {
  id: string;
  name: string;
  description: string;
  conditions: Condition[];
  actions: Action[];
  priority: number;
  enabled: boolean;
}
