import { Graph } from '_@models/Graph';

export const useGraph = () => {
  const graph = new Graph();

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

  return graph;
};
