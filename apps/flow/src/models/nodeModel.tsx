import { type Accessor, createSignal, type Setter } from 'solid-js';

type Point = {
  x: number;
  y: number;
};

type NodeInfo = {
  id: string;
  pos: Point;
  title: string;
  element?: HTMLDivElement;
};

export class BaseNode {
  node: Accessor<NodeInfo>;
  setNode: Setter<NodeInfo>;

  constructor(nodeInfo: NodeInfo) {
    const [node, setNode] = createSignal(nodeInfo);
    this.node = node;
    this.setNode = setNode;
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
  get element() {
    return this.node().element;
  }
  set element(element: HTMLDivElement) {
    this.setNode({ ...this.node(), element });
  }
}
