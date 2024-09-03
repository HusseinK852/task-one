export interface RuleNode {
  _id: string;
  type: string;
  name: string;
  debugMode: boolean;
  configurationVersion: number;
  configuration: any;
  additionalInfo: {
    description: string;
    layoutX: number;
    layoutY: number;
  };
}

export interface Connection {
  fromIndex: number;
  toIndex: number;
  type: boolean | string;
}

export interface Rule {
  _id: string;
  name: string;
  description: string;
  nodes: RuleNode[];
  connections: Connection[];
  enabled: boolean;
}
