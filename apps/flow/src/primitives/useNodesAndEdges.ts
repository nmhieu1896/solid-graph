import { createEffect, createSignal } from 'solid-js';
import { useTranslate } from './useTransform';
import { BaseNode } from '_@models/nodeModel';

const [translate] = useTranslate;

export type Point = {
  x: number;
  y: number;
};

//----------- Node And Edge-------------
export const useNodes = createSignal<BaseNode[]>([
  new BaseNode({ id: '1', pos: { x: 0, y: 0 }, title: 'Node 1' }),
  new BaseNode({ id: '2', pos: { x: 250, y: 100 }, title: 'Node 2' }),
  new BaseNode({ id: '3', pos: { x: 500, y: -100 }, title: 'Node 3' }),
  new BaseNode({ id: '4', pos: { x: 600, y: 300 }, title: 'Node 4' }),
  new BaseNode({ id: '5', pos: { x: 300, y: 300 }, title: 'Node 5' }),
]);
const [nodes, setNodes] = useNodes;

export const addNodes = () => {
  const id = Date.now().toString(36);
  setNodes((nodes) => [
    ...nodes,
    new BaseNode({
      id,
      pos: { x: -translate().x + 200 * Math.random(), y: -translate().y + 200 * Math.random() },
      title: `Node ${id}`,
    }),
  ]);
};

export const useEdges = createSignal<Record<string, string[]>>(
  {
    '1': ['2', '3'],
    '2': ['4'],
  },
  { equals: false }
);
const [edges, setEdges] = useEdges;

export const useNodeMapper = createSignal<Record<string, BaseNode>>({});
const [nodeMapper, setNodeMapper] = useNodeMapper;
//----------- END OF Node And Edge-------------

//Sync node to Node Mapper
createEffect(() => {
  nodes().forEach((node) => {
    nodeMapper[node.id] = node;
  });
  setNodeMapper({ ...nodeMapper });
});

//------------ Edge creation------------
const [edgeSrc, setEdgeSrc] = createSignal<string>();
const [mousePos, setMousePos] = createSignal<Point>();
const allowEdgeCreation = (targetNodeId) => edgeSrc() && targetNodeId && edgeSrc() !== targetNodeId;
export { allowEdgeCreation, edgeSrc, mousePos };

{
  document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      setEdgeSrc(target.parentElement.dataset.nodeId);
    }
  });

  document.addEventListener('mouseup', (e) => {
    const target = e.target;
    queueMicrotask(() => {
      //Defer
      setEdgeSrc(undefined);
      setMousePos(undefined);
    });
    if (!(target instanceof HTMLElement)) return;

    const nodeId = target?.dataset?.nodeId || target?.parentElement?.dataset?.nodeId;
    if (allowEdgeCreation(nodeId)) {
      const newEdges = edges();
      const currentFromId = newEdges[edgeSrc()];
      if (!currentFromId) {
        newEdges[edgeSrc()] = [nodeId];
      } else if (!currentFromId.includes(nodeId)) {
        currentFromId.push(nodeId);
      }
      setEdges(newEdges);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!edgeSrc()) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  });
}
// -------- End of Edge creation---------
