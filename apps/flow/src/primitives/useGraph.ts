import { Graph } from '_@models/Graph';
import axios from 'axios';
import { createEffect } from 'solid-js';

export const graph = new Graph();

// DEBOUNCE update to Database
let debounce: any;
createEffect(() => {
  const newEdges = graph.edges.edges;
  const newNodes = graph.nodes.nodes().map((node) => node.get());

  clearTimeout(debounce);
  debounce = setTimeout(
    () =>
      axios.patch('https://platform-api.sens-vn.com/graph/1', {
        projectId: '1',
        edges: newEdges,
        nodes: newNodes,
      }),
    3000,
  );
});

// Drag to create Edges
{
  document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      graph.edges.edgeSrc = target.parentElement?.dataset.nodeId;
    }
  });

  document.addEventListener('mouseup', (e: any) => {
    graph.edges.clearDraggingEdge();
    graph.edges.createEdge(e.target?.dataset?.nodeId || e.target?.parentElement?.dataset?.nodeId);
  });

  document.addEventListener('mousemove', (e) => {
    graph.edges.mousePos = { x: e.clientX, y: e.clientY };
  });
}
