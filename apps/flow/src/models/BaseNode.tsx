import { type Accessor, createSignal, type Setter, JSX } from 'solid-js';

type Point = {
  x: number;
  y: number;
};

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
  get(): Record<string, any>;
}

export type BaseConstructorProps = Pick<NodeInfo, 'pos'> & Partial<NodeInfo>;

export class BaseNode {
  node: Accessor<NodeInfo>;
  setNode: Setter<NodeInfo>;
  type: NodeType;

  constructor(nodeInfo: BaseConstructorProps) {
    const id = Date.now().toString(36);
    const [node, setNode] = createSignal({ id, title: `node-${this.type} ${id}`, ...nodeInfo });
    this.node = node;
    this.setNode = setNode;
  }

  get() {
    return { ...this.node(), type: this.type };
  }

  get id() {
    return this.node().id;
  }
  get pos() {
    return this.node().pos;
  }
  set pos(pos: Point) {
    this.setNode({ ...this.node(), pos });
  }
  get title() {
    return this.node().title;
  }
  set title(title: string) {
    this.setNode({ ...this.node(), title });
  }
  get element(): HTMLDivElement | undefined {
    return this.node().element;
  }
  set element(element: HTMLDivElement) {
    this.setNode({ ...this.node(), element });
  }
}
