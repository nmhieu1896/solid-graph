import type { Accessor, JSX } from 'solid-js';
import { BaseNode } from './BaseNode';

export interface ISnapshot<T extends { snapshotType: string }> {
  takeSnapshot(): T;
  useSnapshot(snapshot: Omit<T, 'snapshotType'>): void;
}

export type NodeInfo = {
  id: string;
  pos: Point;
  title: string;
  element?: HTMLDivElement;
};

export type NodeType = 'bash' | 'api';

export type SliderRightFormProps<T extends BaseNode> = {
  self: T;
  onSubmit: () => void;
};

export interface INode {
  id: string;
  type: NodeType;
  node: Accessor<NodeInfo>;
  setNode: (node: NodeInfo) => void;
  pos: Point;
  element?: HTMLDivElement;
  title: string;
  SliderRightForm(props: SliderRightFormProps<any>): JSX.Element;
}
