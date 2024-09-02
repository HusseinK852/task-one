import { Document } from "mongoose";

export interface Condition extends Document {
    name: string;
    description?: string;
    expression: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Trigger extends Document {
  name: string;
  description?: string;
  eventType: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Action extends Document {
  name: string;
  description?: string;
  command: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Config extends Document {
  key: string;
  value: any;
  type: string;
}

export interface Rule extends Document {
  name: string;
  triggers: Trigger[];
  conditions: Condition[];
  actions: Action[];
  onFailure: Action[];
  config: Config[];
  enabled: boolean;
}
