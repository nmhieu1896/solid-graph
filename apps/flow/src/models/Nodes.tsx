import { useTranslate } from '_@primitives/useTransform';
import { Accessor, Setter, createSignal } from 'solid-js';
import { ApiNode } from './ApiNode';
import { BaseConstructorProps, NodeInstance, NodeSnapshot } from './BaseNode';
import { BashNode } from './BashNode';
import { Graph } from './Graph';
import { NodeType } from './interfaces';

const [translate] = useTranslate;

export class Nodes {
  private _nodes: Accessor<NodeInstance[]>;
  private _setNodes: Setter<NodeInstance[]>;
  private graph?: Graph;

  constructor(initNodes: (BaseConstructorProps & { type: NodeType })[], graph?: Graph) {
    const [nodes, setNodes] = createSignal(initNodes.map((node) => new nodeMap[node.type](node, graph)));
    this.graph = graph;
    this._nodes = nodes;
    this._setNodes = setNodes as any as Setter<NodeInstance[]>;
  }

  addNode(type: NodeType) {
    const id = Date.now().toString(36);
    this._setNodes((nodes) => [
      ...nodes,
      new nodeMap[type](
        {
          id,
          pos: { x: -translate().x + 200 * Math.random(), y: -translate().y + 200 * Math.random() },
          title: `Node ${id}`,
        },
        this.graph,
      ),
    ]);
  }

  removeNode(id: string) {
    this._setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }

  getNode(id: string) {
    return this._nodes().find((node) => node.id === id);
  }

  useSnapshot(node: NodeSnapshot) {
    return this.getNode(node.id)?.useSnapshot(node);
  }

  get nodes() {
    return this._nodes();
  }
}

type INodeImpl = new (nodeInfo: BaseConstructorProps, graph: Graph) => NodeInstance;
const nodeMap = {
  bash: BashNode,
  api: ApiNode,
} satisfies Record<NodeType, INodeImpl>;
