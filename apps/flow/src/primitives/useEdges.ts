import { Edge } from '_@models/Edge';

export const edge = new Edge({
  '1': ['2', '3'],
  '2': ['4'],
});

{
  document.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('edge-dragger-out')) {
      edge.edgeSrc = target.parentElement?.dataset.nodeId;
    }
  });

  document.addEventListener('mouseup', (e: any) => {
    edge.clearDraggingEdge();
    edge.createEdge(e.target?.dataset?.nodeId || e.target?.parentElement?.dataset?.nodeId);
  });

  document.addEventListener('mousemove', (e) => {
    edge.mousePos = { x: e.clientX, y: e.clientY };
  });
}
