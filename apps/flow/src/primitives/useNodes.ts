import { createEffect, createSignal } from 'solid-js';

export type Point = {
  x: number;
  y: number;
};

export type NodeInfo = {
  id: string;
  pos: Point;
  title?: string;
  element?: HTMLDivElement;
};

const useNodes = createSignal<NodeInfo[]>([
  { id: '1', pos: { x: 0, y: 0 }, title: 'Node 1' },
  { id: '2', pos: { x: 250, y: 100 }, title: 'Node 2' },
  { id: '3', pos: { x: 500, y: -100 }, title: 'Node 3' },
  { id: '4', pos: { x: 600, y: 300 }, title: 'Node 4' },
  { id: '5', pos: { x: 300, y: 300 }, title: 'Node 5' },
]);
const [nodes] = useNodes;

const useEdges = createSignal<Record<string, string[]>>({
  '1': ['2', '3'],
  '2': ['4'],
});

export { useNodes, useEdges };

export const useNodeMapper = createSignal<Record<string, NodeInfo>>({});
const [nodeMapper, setNodeMapper] = useNodeMapper;
export { nodeMapper, setNodeMapper };

createEffect(() => {
  nodes().forEach((node) => {
    nodeMapper[node.id] = node;
  });
  setNodeMapper({ ...nodeMapper });
});
