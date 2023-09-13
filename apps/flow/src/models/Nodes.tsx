import { useTranslate } from '_@primitives/useTransform';
import { Accessor, Setter, createSignal } from 'solid-js';
import { ApiNode } from './ApiNode';
import { BaseConstructorProps, INode, NodeType } from './BaseNode';
import { BashNode } from './BashNode';

const [translate] = useTranslate;

export class Nodes {
  nodes: Accessor<INode[]>;
  setNodes: Setter<INode[]>;

  constructor(initNodes: (BaseConstructorProps & { type: NodeType })[]) {
    const [nodes, setNodes] = createSignal(initNodes.map((node) => new nodeMap[node.type](node)));

    this.nodes = nodes;
    this.setNodes = setNodes as any as Setter<INode[]>;
  }

  addNode(type: NodeType) {
    const id = Date.now().toString(36);
    this.setNodes((nodes) => [
      ...nodes,
      new nodeMap[type]({
        id,
        pos: { x: -translate().x + 200 * Math.random(), y: -translate().y + 200 * Math.random() },
        title: `Node ${id}`,
      }),
    ]);
  }

  removeNode(id: string) {
    this.setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }

  getNode(id: string) {
    return this.nodes().find((node) => node.id === id);
  }
}

type INodeImpl = new (nodeInfo: BaseConstructorProps) => INode;
const nodeMap = {
  bash: BashNode,
  api: ApiNode,
} satisfies Record<NodeType, INodeImpl>;
