import { createSignal } from 'solid-js';

export type NodeInfo = {
  id: string;
  pos: { x: number; y: number };
  title?: string;
  element?: HTMLDivElement;
};

const useNodes = createSignal<NodeInfo[]>([
  { id: '1', pos: { x: 0, y: 0 }, title: 'Node 1' },
  { id: '2', pos: { x: 100, y: 100 }, title: 'Node 2' },
  { id: '3', pos: { x: -300, y: -300 }, title: 'Node 3' },
]);

const useEdges = createSignal<Record<string, string[]>>({
  '1': ['2', '3'],
});

export { useNodes, useEdges };
