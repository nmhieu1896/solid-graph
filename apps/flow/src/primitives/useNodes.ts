import { createEffect, createSignal } from 'solid-js';
import { useTranslate } from './useTransform';
import { INode } from '_@models/BaseNode';
import { BashNode } from '_@models/BashNode';
import { ApiNode } from '_@models/ApiNode';
import { edge } from './useEdges';

const [translate] = useTranslate;

export type Point = {
  x: number;
  y: number;
};

//----------- Node And Edge-------------
export const useNodes = createSignal<INode[]>([
  new ApiNode({ id: '1', pos: { x: 0, y: 0 }, title: 'Node 1' }),
  new ApiNode({ id: '2', pos: { x: 250, y: 100 }, title: 'Node 2' }),
  new ApiNode({ id: '3', pos: { x: 500, y: -100 }, title: 'Node 3' }),
  new BashNode({ id: '4', pos: { x: 600, y: 300 }, title: 'Node 4' }),
  new BashNode({ id: '5', pos: { x: 300, y: 300 }, title: 'Node 5' }),
]);
const [nodes, setNodes] = useNodes;

export const addNodes = () => {
  const id = Date.now().toString(36);
  setNodes((nodes) => [
    ...nodes,
    new BashNode({
      id,
      pos: { x: -translate().x + 200 * Math.random(), y: -translate().y + 200 * Math.random() },
      title: `Node ${id}`,
    }),
  ]);
};

export const useNodeMapper = createSignal<Record<string, INode>>({});
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

{
  document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      edge.edgeSrc = target.parentElement.dataset.nodeId;
    }
  });

  document.addEventListener('mouseup', (e) => {
    const target = e.target;
    queueMicrotask(() => {
      //Defer
      edge.edgeSrc = undefined;
      edge.mousePos = undefined;
    });
    if (!(target instanceof HTMLElement)) return;

    const nodeId = target?.dataset?.nodeId || target?.parentElement?.dataset?.nodeId;
    edge.createEdge(nodeId);
  });

  document.addEventListener('mousemove', (e) => {
    if (!edge.edgeSrc) return;
    edge.mousePos = { x: e.clientX, y: e.clientY };
  });
}
// -------- End of Edge creation---------
