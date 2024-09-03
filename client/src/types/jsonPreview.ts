import type { Connection, RuleNode } from './rule'

export interface JsonPreview {
  _id?: string;
  name: string | null;
  description: string;
  nodes: RuleNode[];
  connections: Connection[];
  enabled?: boolean;
}
