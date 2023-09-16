import { Graph } from '_@models/Graph';
import { onCleanup } from 'solid-js';

export const useGraph = () => {
  const graph = new Graph();
  const onMouseDown = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      graph.edges.edgeSrc = target.parentElement?.dataset.nodeId;
    }
  };
  const onMouseUp = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      graph.edges.edgeSrc = target.parentElement?.dataset.nodeId;
    }
  };
  const onMouseMove = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      graph.edges.edgeSrc = target.parentElement?.dataset.nodeId;
    }
  };

  // Drag to create Edges
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);
  onCleanup(() => {
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onMouseMove);
  });
  // Drag to create Edges

  return graph;
};
