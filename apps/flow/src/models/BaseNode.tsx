import { type Accessor, createSignal, type Setter, JSX } from 'solid-js';
import { Graph } from './Graph';

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
  setNode: Setter<NodeInfo>;
  pos: Point;
  element?: HTMLDivElement;
  title: string;
  SliderRightForm(props: any): JSX.Element;
  takeSnapshot(): Record<string, any>;
  // updateHistory: () => void;
  // setUpdateHistory: () => void;
}

export type BaseConstructorProps = Pick<NodeInfo, 'pos'> & Partial<NodeInfo>;

export class BaseNode {
  node: Accessor<NodeInfo>;
  setNode: Setter<NodeInfo>;
  type: NodeType;
  graph: Graph;
  attributes: Record<string, any> = {};
  // throttleFlag = false;

  constructor(nodeInfo: BaseConstructorProps, graph: Graph) {
    const id = Date.now().toString(36);
    const [node, setNode] = createSignal({ id, title: `node-${this.type} ${id}`, ...nodeInfo });
    this.node = node;
    this.setNode = setNode;
    this.graph = graph;
  }

  updateHistory() {
    this.graph.pushHistory({ ...this.takeSnapshot(), snapshotType: 'node' });
  }

  useSnapshot(data: NodeSnapshot) {
    const { attributes, ...node } = data;
    this.setNode({ ...node, element: this.node().element });
    this.attributes = attributes;
  }

  takeSnapshot() {
    return { ...this.node(), type: this.type, attributes: this.attributes };
  }

  get id() {
    return this.node().id;
  }
  get pos() {
    return this.node().pos;
  }
  set pos(pos: Point) {
    this.updateHistory();
    this.setNode({ ...this.node(), pos });
  }
  get title() {
    return this.node().title;
  }
  set title(title: string) {
    this.updateHistory();
    this.setNode({ ...this.node(), title });
  }
  get element(): HTMLDivElement | undefined {
    return this.node().element;
  }
  set element(element: HTMLDivElement) {
    this.setNode({ ...this.node(), element });
  }
}

export type NodeInstance = INode & BaseNode;
export type NodeSnapshot = Omit<NodeInfo, 'element'> & {
  snapshotType: 'node';
  type: NodeType;
  attributes: Record<string, any>;
};
