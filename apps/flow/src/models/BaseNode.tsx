import { createSignal, type Accessor, type Setter } from 'solid-js';
import { Graph } from './Graph';
import { INode, NodeInfo, NodeType, ISnapshot } from './interfaces';

export type BaseConstructorProps = Pick<NodeInfo, 'pos'> & Partial<NodeInfo>;

export class BaseNode implements ISnapshot<NodeSnapshot> {
  node: Accessor<NodeInfo>;
  private _setNode: Setter<NodeInfo>;
  type: NodeType;
  graph: Graph;
  attributes: Record<string, any> = {};

  constructor(nodeInfo: BaseConstructorProps, graph: Graph) {
    const id = Date.now().toString(36);
    const [node, setNode] = createSignal({ id, title: `node-${this.type} ${id}`, ...nodeInfo });
    this.node = node;
    this._setNode = setNode;
    this.graph = graph;
  }

  setNode(node: NodeInfo) {
    this.updateHistory();
    this._setNode(node);
    this.updateHistory();
  }

  updateHistory() {
    this.graph.pushHistory({ ...this.takeSnapshot(), snapshotType: 'node' });
  }

  useSnapshot(data: Omit<NodeSnapshot, 'snapshotType'>) {
    const { attributes, ...node } = data;
    this._setNode({ ...node, element: this.node().element });
    this.attributes = attributes;
  }

  takeSnapshot(): NodeSnapshot {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { element, ...currNode } = this.node();
    return { ...currNode, type: this.type, attributes: this.attributes, snapshotType: 'node' };
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
    this._setNode({ ...this.node(), element });
  }
}

export type NodeInstance = INode & BaseNode;
export type NodeSnapshot = Prettify<
  Omit<NodeInfo, 'element'> & {
    snapshotType: 'node';
    type: NodeType;
    attributes: Record<string, any>;
  }
>;
