import { Document } from "mongoose";

export interface RuleNode extends Document {
  type: string;
  name: string;
  debugMode: boolean;
  singletonMode: boolean;
  queueName: string | null;
  configurationVersion: number;
  configuration: any;
  additionalInfo: {
    description: string;
    layoutX: number;
    layoutY: number;
  };
}

export interface connections extends Document {
  fromIndex: number;
  toIndex: number;
  type: boolean | string;
}
export interface Rule extends Document {
  name: string;
  description: string;
  nodes: RuleNode[];
  connections: connections[];
  enabled: boolean;
}
